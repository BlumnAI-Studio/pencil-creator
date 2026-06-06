# midi-orchestra.md — MIDI 기반 캐릭터 연주 데모 전문 지식

`design/sprite/output/`의 캐릭터 스프라이트 자산(Case S 산출)을 활용하여 **MIDI 파일을 입력으로 받아 시간축에 따라 해당 악기 캐릭터를 동적으로 등장·연주·정지시키는 웹 데모**(Case W 변형)를 구현할 때 참조하는 지식 문서.

**최초 정착**: 2026-06-06 / `design/xaml/output/sample14/index.html` (Pixel Orchestra) 제작 시 정립.

---

## 1. 입력 → 출력 정의

| 항목 | 내용 |
|------|------|
| 입력 | `.mid` (Standard MIDI File, MThd 헤더) + Case S 산출 스프라이트 시트 + 무대 배경 PNG |
| 처리 | 브라우저 단독 (정적 호스팅, 서버 없음) |
| 출력 | HTML 데모 (콤보박스 곡 선택 → 자동 캐릭터 등장 + 시간축 동기화 idle/play 토글 + Tone.js 재생) |
| 호환 | GitHub Pages, file:// 외 일반 정적 서버 |

---

## 2. 라이브러리 스택 (검증 완료, sample14에서 사용)

```html
<script type="module">
  import * as Tone from 'https://cdn.jsdelivr.net/npm/tone@14.7.77/+esm';
  import { Midi } from 'https://cdn.jsdelivr.net/npm/@tonejs/midi@2.0.28/+esm';
</script>
```

| 라이브러리 | 역할 | 비고 |
|------------|------|------|
| `@tonejs/midi` | MIDI 파싱 → `track[].notes[]`로 시간/duration/pitch 추출 | 재생 X (파싱 전용) |
| `tone` | Web Audio 재생 (`PolySynth`) + `Transport` 스케줄링 | SoundFont 없이 합성 가능 |

**대안 검토 (sample14에서 채택 안 함)**:
- `html-midi-player` — Magenta 진영 web component. SoundFont 내장 재생 가능하지만 커스텀 시각화(캐릭터 spawn) 통합이 어려움.
- `SpessaSynth` — SF2/DLS 풀 SoundFont, 무거움 (~200KB+ + sf2 파일).

---

## 3. GM Program → 캐릭터 slug 매핑 (19개 캐릭터 기준)

General MIDI Level 1 Program 번호 + 트랙명 패턴 이중 매칭 (트랙명 우선).

### 3-1. 트랙명 패턴 (`track.name` 정규식, 우선 적용)

```javascript
if (/soprano/i.test(name))     return 'vocal-1';
if (/alto/i.test(name))        return 'vocal-2';
if (/tenor/i.test(name))       return 'vocal-3';
if (/\bbass\b/i.test(name))    return 'vocal-4';
if (/choir|voice/i.test(name)) return 'vocal-1';
if (/violin/i.test(name))      return 'violin';
if (/viola/i.test(name))       return 'viola';
if (/cello/i.test(name))       return 'cello';
if (/contrabass|double bass/i.test(name)) return 'contrabass';
if (/flute/i.test(name))       return 'flute';
if (/clarinet/i.test(name))    return 'clarinet';
if (/oboe/i.test(name))        return 'oboe';
if (/trumpet/i.test(name))     return 'trumpet';
if (/trombone/i.test(name))    return 'trombone';
if (/horn/i.test(name))        return 'horn';
if (/tuba/i.test(name))        return 'tuba';
if (/drum|percussion/i.test(name)) return 'drum';
if (/guitar/i.test(name))      return 'guitar';
if (/harp/i.test(name))        return 'harp';
if (/piano/i.test(name))       return 'piano';
```

### 3-2. GM Program 번호 (폴백)

| Program # | 분류 | 캐릭터 slug |
|-----------|------|------------|
| 0–7   | Piano family   | `piano` |
| 24–31 | Guitar family  | `guitar` |
| 40    | Violin         | `violin` |
| 41    | Viola          | `viola` |
| 42    | Cello          | `cello` |
| 43    | Contrabass     | `contrabass` |
| 46    | Harp           | `harp` |
| 56    | Trumpet        | `trumpet` |
| 57    | Trombone       | `trombone` |
| 58    | Tuba           | `tuba` |
| 60    | French Horn    | `horn` |
| 68    | Oboe           | `oboe` |
| 71    | Clarinet       | `clarinet` |
| 72–73 | Piccolo/Flute  | `flute` |
| 52–54 | Choir Aahs/Voice Oohs | `vocal-1` |
| 80–95 | Synth Pads (choir 폴백) | `vocal-2` |
| 그 외 | 미매핑 → 폴백 | `piano` |

### 3-3. 드럼 채널 특수 처리

MIDI 사양상 **채널 9 (= 1-indexed 10)** 는 항상 드럼킷. Program 번호 무시:

```javascript
const isDrum = track.channel === 9 || /drum|percussion/i.test(track.name);
const slug = isDrum ? 'drum' : programToSlug(track.instrument?.number ?? 0, track.name);
```

---

## 4. 활성 구간(interval) 빌드 — 자연스러운 애니메이션의 핵심

각 캐릭터별로 "지금 이 시점에 연주 중인가"를 빠르게 판정하기 위해 `[{start, end}, ...]` 형식의 정렬·머지된 구간 배열을 만든다.

```javascript
const SUSTAIN_GRACE = 1.0;   // seconds — 노트 끝난 후에도 play 포즈 유지
const MERGE_GAP    = 1.2;    // seconds — 이 간격 이내 갭은 같은 phrase로 잇기

for (const slug of Object.keys(characterIntervals)) {
  const arr = characterIntervals[slug]
    .map(iv => ({ start: iv.start, end: iv.end + SUSTAIN_GRACE }))
    .sort((a,b) => a.start - b.start);
  const merged = [];
  for (const iv of arr) {
    const last = merged[merged.length-1];
    if (last && iv.start - last.end < MERGE_GAP) {
      last.end = Math.max(last.end, iv.end);
    } else {
      merged.push({ ...iv });
    }
  }
  characterIntervals[slug] = merged;
}
```

**튜닝 가이드**:
- `SUSTAIN_GRACE` 작을수록 정확하지만 끊김. 크면 자연스럽지만 시각-청각 어긋남.
- `MERGE_GAP` 작을수록 phrase 분리 정밀. 크면 한 phrase로 묶임.
- 권장 범위: `SUSTAIN_GRACE 0.6~1.2s`, `MERGE_GAP 0.8~1.5s`.
- staccato 곡(Vivaldi 등)은 크게, sustain 곡(Largo)은 작게.

---

## 5. 무대 동적 배치 알고리즘 (append-only)

사용자 요구: *"악기가 새롭게 등장하면 씬에서 적절한 위치를 잡습니다. 동적으로 추가가 되지만 제거는 되지 않습니다."*

### 5-1. 등장 순서 결정

```javascript
const entrySequence = Object.entries(characterIntervals)
  .map(([slug, ivs]) => ({ slug, firstTime: ivs[0].start }))
  .sort((a,b) => a.firstTime - b.firstTime);
```

### 5-2. 무대 좌표 큐 (정규화 비율)

오케스트라 배치 관례에 따라 4행 19칸 (앞→뒤 = 솔로 → 현 → 목관 → 금관/타악):

```javascript
const POSITIONS = [
  // row 0 — 앞열 (솔로/보컬): 5칸
  { x: 0.30, y: 0.80 }, { x: 0.40, y: 0.80 }, { x: 0.50, y: 0.80 },
  { x: 0.60, y: 0.80 }, { x: 0.70, y: 0.80 },
  // row 1 — 현악기: 6칸
  { x: 0.25, y: 0.70 }, { x: 0.35, y: 0.70 }, { x: 0.45, y: 0.70 },
  { x: 0.55, y: 0.70 }, { x: 0.65, y: 0.70 }, { x: 0.75, y: 0.70 },
  // row 2 — 목관: 5칸
  { x: 0.30, y: 0.60 }, { x: 0.40, y: 0.60 }, { x: 0.50, y: 0.60 },
  { x: 0.60, y: 0.60 }, { x: 0.70, y: 0.60 },
  // row 3 — 금관/타악: 3칸 (뒷줄)
  { x: 0.35, y: 0.52 }, { x: 0.50, y: 0.52 }, { x: 0.65, y: 0.52 },
];
```

**좌표 의미**: `(x, y)`는 stage의 정규화 비율 (0~1). 캐릭터 element는 `transform: translate(-50%, -100%)`로 발끝이 좌표에 맞춰 위쪽으로 그려짐.

### 5-3. spawn 로직 (등장만, 절대 제거 X)

```javascript
let nextPosIdx = 0;
function spawnCharacter(slug) {
  if (characterEntries[slug]) return;        // 이미 등장한 캐릭터는 재배치 안 함
  const pos = POSITIONS[nextPosIdx % POSITIONS.length];
  nextPosIdx++;
  // ... DOM 생성 + 위치 지정
}
```

**대안 알고리즘** (향후 확장):
- 악기 분류 우선순위 (가수=앞, 현=중앙, 관=뒤): 현재 등장 순서 기반에서 → 악기 분류 우선 배치로 변경 가능
- 충돌 회피 (예: 등장한 캐릭터 근처 회피): A* 또는 spiral 탐색
- 무대 영역 분할 (Concert Hall = 직사각형, Garden = 부채꼴): 배경별 POSITION 세트

---

## 6. Tone.js 재생 — 두 번째 재생 시 무음 방지

`Tone.Transport.start()` 후 `stop()` → `start()` 사이클에서 schedule된 이벤트가 살아남거나, dispose된 synth로 callback이 발사되어 콘솔 에러가 쏟아질 수 있다.

### 6-1. Hard reset 패턴 (검증된 robust 패턴)

```javascript
function hardResetTransport() {
  try { Tone.Transport.stop(); } catch(e) {}
  try { Tone.Transport.cancel(0); } catch(e) {}   // 모든 scheduled events 제거
  Tone.Transport.position = 0;
  synths.forEach(s => { try { s.releaseAll && s.releaseAll(); s.dispose(); } catch(e) {} });
  synths = [];
}

async function startPlayback() {
  hardResetTransport();                            // 매번 fresh 시작
  if (updateRafId) { cancelAnimationFrame(updateRafId); updateRafId = null; }
  await Tone.start();                              // 첫 user gesture 이후 idempotent
  if (Tone.context.state !== 'running') await Tone.context.resume();
  // ... 새 synth 생성 + scheduleNotes + Tone.Transport.start('+0.05')
  playStartedAt = Tone.now() + 0.05;               // 50ms lead-in으로 첫 노트 clipping 방지
}
```

### 6-2. PolySynth 음색 차별화 (간이)

SoundFont 없이도 캐릭터별 음색 차이를 표현하려면 oscillator type을 다양화:

```javascript
const s = new Tone.PolySynth(Tone.Synth, {
  oscillator: {
    type: slug === 'drum' ? 'square'
        : slug.startsWith('vocal') ? 'sine'
        : 'triangle'
  },
  envelope: { attack: 0.02, decay: 0.1, sustain: 0.4, release: 0.5 },
  volume: -10,
}).toDestination();
```

**더 사실적인 음색이 필요할 때**: Tone.Sampler + SoundFont SF2 파일 또는 [Tone.js 공식 sampler 예제](https://tonejs.github.io/examples/) 의 piano sampler 채택. SF2 파일 (~2MB)을 별도 호스팅.

---

## 7. 스프라이트 시트 통합 (CSS frame stepping)

Case S 산출 시트는 `48px × 4프레임` 가로 배치, 2px 패딩 — 시트 전체 크기 `202 × 52`.

### 7-1. CSS 변수 기반 비례 확대

```css
:root { --char-size: 96px; }   /* 2× of 48 */

.character {
  width: var(--char-size);
  height: var(--char-size);
  background-size: calc(var(--char-size) * 202 / 48) calc(var(--char-size) * 52 / 48);
  background-position: calc(var(--char-size) * -2 / 48) calc(var(--char-size) * -2 / 48);
  image-rendering: pixelated;
  transform: translate(-50%, -100%);  /* 발끝이 좌표에 맞춰지도록 */
}

.character.idle    { animation: char-idle-anim 0.6s steps(4) infinite; }
.character.playing { animation: char-play-anim 0.35s steps(4) infinite; }

@keyframes char-idle-anim {
  from { background-position: calc(var(--char-size) * -2  / 48) calc(var(--char-size) * -2 / 48); }
  to   { background-position: calc(var(--char-size) * -202 / 48) calc(var(--char-size) * -2 / 48); }
}
@keyframes char-play-anim {
  from { background-position: calc(var(--char-size) * -2  / 48) calc(var(--char-size) * -2 / 48); }
  to   { background-position: calc(var(--char-size) * -202 / 48) calc(var(--char-size) * -2 / 48); }
}
```

⚠️ **CSS calc 함정**: `<length> * <length>`는 invalid. `var(--char-size) / 48 * 202px`는 작동 안 함 (px × px). 반드시 `var(--char-size) * 202 / 48` 형식으로 — `<length> * <number> / <number>` = `<length>` ✅.

⚠️ **background-position-y inline + background-position-x animation**은 일부 브라우저에서 통합되지 않음. **반드시 `background-position` 전체를 keyframe에서 제어**.

### 7-2. JS에서 mode 토글

```javascript
function setCharacterMode(slug, mode /* 'idle' | 'playing' */) {
  const entry = characterEntries[slug];
  if (!entry || entry.mode === mode) return;       // 중복 갱신 방지 (애니메이션 reset 방지)
  entry.mode = mode;
  entry.el.classList.toggle('idle', mode === 'idle');
  entry.el.classList.toggle('playing', mode === 'playing');
  entry.el.style.backgroundImage = `url('sprites/${slug}/${mode === 'playing' ? 'play' : 'idle'}.png')`;
}
```

---

## 8. 새 MIDI 파일 추가 절차

사용자 요구: *"새로운 midi 파일이 추가될수 있으니 이 방법은 하네스 전문가를 추가하고 지식을 보유합니다."*

### 8-1. 단일 파일 추가 (5분)

1. `.mid` 파일을 `design/xaml/output/sample14/midi/` 디렉토리에 복사 (라이선스 PD/CC0 확인)
2. `index.html`의 `<select id="midi-select">` 에 `<option>` 한 줄 추가:
   ```html
   <option value="midi/06-my-piece.mid">Composer · Piece Title</option>
   ```
3. 추가 코드 없음 — 트랙명/Program으로 자동 매핑

### 8-2. 새 악기 캐릭터 추가 (Case S 워크플로우와 연계)

기존 19명 외 새 악기(예: saxophone)를 추가하려면:

1. `image/sprite/악단컨셉.png` 또는 신규 컨셉아트에 캐릭터 추가
2. Case S 워크플로우 재실행 (sprite-analyze → Gemini edit → postprocess → sheet 조립)
3. `design/sprite/output/saxophone/{idle,play}.{png,json}` 추가
4. `sample14/sprites/saxophone/` 에 복사
5. `programToSlug()` 매핑에 `saxophone` 추가 (GM 64–67 = Sax family)
6. (선택) `POSITIONS` 배열에 자리 1개 추가 (대부분 자동 wraparound로 OK)

### 8-3. 신뢰 가능한 PD MIDI 출처

| 출처 | URL | 라이선스 | 직접 다운로드 |
|------|-----|---------|--------------|
| mfiles.co.uk | https://www.mfiles.co.uk/classical-midi.htm | PD-old (작곡가 사후 70+년) | ✅ `/downloads/*.mid` 직링크 |
| Mutopia Project | https://www.mutopiaproject.org | CC0 / PD | ✅ ZIP 또는 직링크 |
| BitMidi | https://bitmidi.com | PD | ⚠️ 페이지 navigation 필요 |
| Magenta MAESTRO | https://magenta.tensorflow.org/datasets/maestro | CC BY-NC-SA | ⚠️ 피아노 솔로 위주 |

⚠️ kunstderfuge.com은 일일 5개 무료 제한 있음 — 자동화엔 부적합.

---

## 9. 알려진 함정 & 해결

| 함정 | 증상 | 해결 |
|------|------|------|
| 트랙명/program 미매핑 | 캐릭터 미등장 | `programToSlug` 폴백을 `piano`로 + 매핑 테이블 확장 |
| 두 번째 재생 무음 | Stop 후 다음 Play 시 소리 없음 | §6-1 hardResetTransport 패턴 적용 |
| 콘솔 "Synth was already disposed" | Stop 시 200+ 에러 (silent, audio는 정상) | try/catch로 가드 (UX엔 영향 없음 — cosmetic만) |
| 스프라이트 frame stepping 안 됨 | 캐릭터가 멈춰 보임 | §7-1 CSS calc 함정 + background-position 통합 keyframe |
| AudioContext suspended | Play 클릭 후 무음 | `await Tone.start()` 후 `Tone.context.resume()` 명시적 호출 |
| 리사이즈 시 footer가 stage 잠식 | 캐릭터 발/footer 가까이 잘림 | footer `flex-wrap: nowrap` + active-instruments `overflow-x: auto` |
| 배경 floor가 안 보임 | stage 작아지면 무대 바닥 잘림 | `background-position: center 70%` (또는 `center bottom`) |
| 노트가 짧으면 idle/play 토글 깜빡임 | 캐릭터가 너무 자주 자세 바꿈 | §4 SUSTAIN_GRACE + MERGE_GAP 적용 |
| CORS 차단 | 외부 .mid 로드 실패 | `sample{N}/midi/` 로컬 보관 (정적 호스팅 동일 출처) |

---

## 10. 평가 시 참조 포인트 (Case W 변형)

이 패턴으로 만든 데모를 Case W로 평가할 때, design-craft.md §5 (Case W 3축)에 더해 다음을 추가 가중:

- **W1 디자인 커버리지**: 사용한 캐릭터 종수 (19개 중 N개) + 무대 배경 종수 (sample14는 3개)
- **W2 애니메이션 충실도**: 시간축 동기화 정확도 + SUSTAIN_GRACE 적용 부드러움 + 두 번째 재생 robust성
- **W3 독창적 확장**: MIDI 파일 다양성 (시대·악기 구성) + 새 MIDI 추가 절차 명문화 + 신규 악기 캐릭터 추가 경로 제공

S→W 파이프라인 보너스(×1.3) 조건: Case S 산출 자산을 그대로 활용했는가 (sprites/{slug}/{idle,play}.png가 design/sprite/output/{slug}/와 동일 또는 사본).
