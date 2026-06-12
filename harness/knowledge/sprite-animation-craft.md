# sprite-animation-craft.md — 캐릭터 컨셉아트 → 일관성 스프라이트 애니메이션 지식

`sprite-animator` 에이전트가 참조하는 도메인 지식. 2026-06-06~12 픽셀 음악단(19명) + 픽셀 댄스단(36명) 실제 진행 과정에서 얻은 **성공 패턴 + 실패 패턴 + 교정 패턴**을 정리한다.

기본 평가축은 `harness/knowledge/design-craft.md` §4-3 (Case S)을 그대로 사용한다. 본 문서는 **방법론·함정·치료법**에 집중한다.

---

## 1. 입출력 모델 (간소 vs 풀)

| 모드 | 입력 | 라운드 | 산출 | 사용 사례 |
|------|------|--------|------|-----------|
| 간소 (single-pose) | 컨셉아트 1장 | 1 라운드 × N 캐릭터 | 1프레임 시트 + JSON | 캐릭터맵, 카탈로그 |
| 풀 (multi-frame) | 컨셉아트 1장 + 검증된 reference | 2 라운드 (single-pose → cycle) | 4프레임 시트 + JSON + master + index | 게임 자산, sample14 |

간소 모드의 산출물을 **풀 모드의 reference로 재활용**하는 게 일관성의 핵심 — 한 번 검증된 캐릭터 정체성이 다음 라운드에서도 유지된다.

---

## 2. 파이프라인 (5 Phase)

```
Phase 1 — analyze
   컨셉아트 비전 분석 → 캐릭터 슬롯 N명 + 박스 좌표 + 캐릭터별 desc
Phase 2 — pilot
   1~2명 시범 호출 (Gemini edit, chroma green) → 박스/desc/프롬프트 검증
Phase 3 — batch
   N명 × M 프레임 일괄 호출 (백그라운드, 30분~1시간)
Phase 4 — fix-pass
   머리 중복/침범/chroma 잔여 진단 → 문제 프레임만 clean reference로 재호출
Phase 5 — integrate
   192×192 후처리 → Aseprite Hash JSON → master 조립 → sample{N} 미러
```

각 Phase의 결정점 + 실패 패턴은 §3~§7에서 다룬다.

---

## 3. Phase 1 — analyze (컨셉아트 분석)

### 3-1. 박스 좌표 정밀화 — std 기반 행/열 검출

**실패 패턴**: 균등 분할(6행 × 150px) → 하단 3행이 60~100px씩 어긋나 인접 행 침범.
실제 사례: `image/sprite/댄스단컨셉.png` 1차에서 cheer-1이 waacking 캐릭터로 변형, ballet-3 박스가 다음 행 일부 포함.

**성공 패턴** (`tmp-rowscan.py` 검증):
```python
char_area = arr[:, 600:1500, :]              # 좌측 라벨 패널 제거
gray = char_area.mean(axis=2)
row_std = gray.std(axis=1)
row_std_s = np.convolve(row_std, np.ones(8)/8, mode='same')

# std < 10 → 갭, std > 35 → 캐릭터 라인
# 행 경계 6개 검출 → 댄스단 정확한 y 좌표 확보:
#   K-POP 70-190 / HIP-HOP 210-330 / JAZZ 350-460 /
#   BALLET 500-610 / CHEER 640-740 / WAACKING 770-870
```

검증: `image/sprite/preview-grid-dance.png`에 스타일별 색 박스 오버레이로 시각 검증.

### 3-2. 캐릭터별 명시적 desc 필수

박스 안에 인접 캐릭터가 살짝 침범해도 Gemini가 중심 객체를 식별하도록 **머리색·의상색·악기/소품을 명시**한다.

✅ **좋은 desc**: `"girl with brown hair in twin tails with ribbons, white and red cheerleading uniform, holding white pom-poms, bright smile"`
❌ **나쁜 desc**: `"a cheerleader"` (Gemini가 인접 행 보라색 댄서를 그대로 그릴 위험)

악단/댄스단의 desc는 `image/sprite/character-boxes{*}.json`의 `desc` 필드에 저장한다. 이 desc가 Phase 2/3/4의 모든 프롬프트에 그대로 주입된다.

### 3-3. 박스 여유는 ±15~20px

너무 빡빡하면 모자 위쪽·발끝·악기 끝이 잘림 → Gemini가 잘린 부분을 추측해 다른 캐릭터로 보강하는 부작용 발생.
악단(`character-boxes.json`)에서 1차 시도 후 piano 등 일부 캐릭터가 잘려 ±20px 확장.

---

## 4. Phase 2 — pilot (시범 호출)

### 4-1. piano 1명 / cheer-1 1명 패턴

**성공 패턴**: 19명/36명 전체 배치 전에 **1명만 먼저** Gemini edit 호출 → 시각 검증 → 점수 ≥70 또는 시각적으로 OK일 때만 배치.

cheer-1 시범에서 4컷 cycle이 의상 100% 유지 + 포즈만 변화하는 것을 확인 후 35명 배치 진행.

### 4-2. Gemini `edit()` + reference 이미지

- 모델: `gemini-3.1-flash-image-preview`
- `input_image`로 reference 전달 → 캐릭터 정체성 보존의 핵심
- **chroma green** `#00FF00` 배경 + 단일 캐릭터 강제
- 시드는 hash(slug) % 2^32 (캐릭터 일관성)

reference 선택 우선순위:
1. `image/sprite/crops/{slug}.png` — 컨셉아트 직접 크롭 (1라운드)
2. `image/sprite/raw_dance/{style}/{slug}.png` — 1라운드 검증된 결과 (2라운드 multi-frame)
3. `image/sprite/raw{*}/{slug}-pose-fN.png` — 동일 캐릭터의 다른 정상 프레임 (fix-pass)

---

## 5. Phase 3 — batch (대량 호출)

### 5-1. 백그라운드 batch 패턴

19 × 8 = 152 / 36 × 4 = 144 호출 시 백그라운드 실행 + 자동 알림 활용. 보통 7~30분 소요.

배치 스크립트 핵심:
- `skip-exists` 로직: 이미 생성된 파일은 건너뛰기 → 재시도 시 실패한 것만 다시 호출
- 매 호출 후 `tmp-batch-call.log.json`에 결과 저장 → 중단되어도 복구

### 5-2. 호출 실패 처리

Gemini가 일시적으로 이미지 미반환(`'NoneType' object has no attribute 'save'`) → batch 종료 후 같은 스크립트로 재실행하면 미생성 파일만 자동 재호출.

비용 기준:
- 단일 포즈 batch: 호출당 ≈ $0.039
- 4프레임 batch: 캐릭터당 4호출 = $0.156

---

## 6. Phase 4 — fix-pass (아티팩트 교정)

### 6-1. 머리/캐릭터 중복 — 발견 패턴

**시각적 단서**: 동일 프레임에 같은 모자·의상이 두 개. 또는 한 캐릭터 옆에 작은 보조 캐릭터.

**실제 발견 사례** (악단/댄스단 1차 fix 후 잔여):
- `flute play f0`, `flute play f3`
- `clarinet idle f2`, `clarinet play f0/f3`
- `horn play f2/f3`
- `tuba play f3` (drum 캐릭터 침범)
- `viola play f2` (캐릭터 정체성 변경)
- `hiphop-1 f1/f2/f3` (모든 프레임 둘)

### 6-2. 1차 교정 — 강조 프롬프트

reference는 컨셉아트 crop 또는 raw_dance 단일 포즈를 유지하되, 프롬프트에 단일 캐릭터 강조:

```
⚠️ STRICTLY ONE CHARACTER. Do NOT draw two people, do NOT duplicate the character,
do NOT include any adjacent dancers or background figures. Exactly one isolated
character centered.
```

성공률: ~70% (11/12 = 91% 시도, 3개 frame 잔존)

### 6-3. 2차 교정 — Clean Frame as Reference

**핵심 발견 (2026-06-12 검증)**: reference 이미지 자체가 인접 캐릭터를 포함하면 Gemini가 그 정보를 따라 그림.

**해결**: reference를 **동일 캐릭터의 검증된 정상 frame**으로 변경.

```
clarinet play f3 fix:
  reference = image/sprite/raw/2026-06-06-clarinet-play-f1.png  ← f1은 정상
  강조 프롬프트 + "follow-through, lowering clarinet slightly" 등 cycle 위치 명시

tuba play f3 fix:
  reference = image/sprite/raw/2026-06-06-tuba-play-f1.png

hiphop-1 f3 fix:
  reference = image/sprite/raw_dance_anim/hiphop/hiphop-1-f0.png
```

성공률: 100% (3/3 정상 단일 캐릭터로 완벽 fix).

### 6-4. chroma green 잔여

HSV 매팅 후에도 캐릭터 외곽에 작은 녹색 픽셀이 남음 → `hiphop-1` f3 우측에 작은 녹색 잔여 확인됨.

해결책 우선순위:
1. **재호출**(가장 깨끗) — fix-pass의 2차 교정과 동시에 chroma 잔여도 해소
2. BiRefNet 매팅 (의존성 +1GB)
3. HSV 키 임계값 조정 (`g > r + 50` 식으로 강화)

---

## 7. Phase 5 — integrate (시트·master·미러)

### 7-1. 192×192 고해상도 시트

raw Gemini 출력(~800px)을 **48×48이 아닌 192×192로 다운스케일**해야 실제 디테일이 살아남.

CSS calc 함정:
```css
/* ❌ length × length invalid */
background-size: calc(var(--char-size) / 48 * 202px) ...;

/* ✅ length × number / number = length */
background-size: calc(var(--char-size) * 202 / 48) ...;
```

또한 padding을 frame size에 비례 스케일(48 → 2, 192 → 8) 해야 CSS 비율 일정.

### 7-2. 시트 조립

| 컬렉션 | 시트 | master |
|--------|------|--------|
| 악단 (19 × idle+play 4f) | 808×208 | 408×3952 (cell w=192+8, master는 first-frame 카탈로그) |
| 댄스단 (36 × dance 4f) | 808×208 | 4848×1248 (6 styles × 6 dancers × full 4-frame sheet) |

### 7-3. Aseprite Hash JSON

표준 필드: `frames`, `meta.app/version/image/format/size/scale/frameTags/slug`. 이 포맷이 Phaser·Godot에서 즉시 로드 가능.

### 7-4. sample14 미러

`design/sprite/output{*}/...`을 `design/xaml/output/sample14/{sprites|dance}/...`에 복사. 미러는 후처리 스크립트의 마지막 단계에서 자동 처리.

---

## 8. sample14와의 통합 (S→W 파이프라인)

### 8-1. CSS 패턴

```css
.character, .dancer {
  width: var(--char-size);
  height: var(--char-size);
  background-size: calc(var(--char-size) * 808 / 192) calc(var(--char-size) * 208 / 192);
  background-position: calc(var(--char-size) * -8 / 192) calc(var(--char-size) * -8 / 192);
  animation: char-play-anim var(--dance-cycle, 1s) steps(4) infinite;
  animation-play-state: paused;
}
.dancing, .playing { animation-play-state: running; }
```

`animation-play-state` 토글이 핵심 — paused 시 현재 frame 보존, running 시 그 위치부터 이어감.

### 8-2. JS 분리

- **음악단(orchestra)**: MIDI 트랙 active interval → 캐릭터 playing/resting
- **댄스단(dance)**: 자율 dance cycle + BPM 동기화 + 음역대 6분할 onset jump

자세한 통합 패턴은 `harness/knowledge/midi-orchestra.md` 참조.

---

## 9. 실패 패턴 카탈로그

| 증상 | 원인 | 치료 |
|------|------|------|
| 캐릭터 의상이 컨셉과 다름 | 박스 좌표 어긋남 | std 기반 행 검출, ±15px 패딩 |
| 4프레임 사이 의상 변경 | reference 없는 generate() 모드 | edit() + 캐릭터별 desc + 시드 고정 |
| 두 캐릭터 동시 출현 | 박스 침범 + 약한 프롬프트 | "STRICTLY ONE CHARACTER" + clean frame reference |
| chroma green 잔여 | HSV 키 임계값 부족 | clean frame reference로 재호출이 가장 깨끗 |
| 픽셀 그리드 어긋남 | nearest 다운스케일 미적용 | `Image.resize((W,H), Image.NEAREST)` 강제 |
| 시트 비율 깨짐 | padding이 frame size와 비례 안 함 | padding = 2 × target_w / 48 비례 스케일 |
| sample 데모에서 작아 보임 | 48×48 raw 다운스케일 → 4× nearest upscale (디테일 X) | raw에서 192×192로 직접 다운스케일 |
| 시트는 정상인데 master 작음 | assemble의 TARGET_W default 24 사용 | `--target-size 192x192` 옵션으로 override |

---

## 10. 권장 산출 디렉토리 패턴

```
image/sprite/
  {name}컨셉.png                      # 원본
  character-boxes{*}.json              # 박스 + desc
  crops{*}/...                         # 컨셉아트 크롭
  raw{*}/...                           # Gemini 1라운드
  raw_dance_anim/{style}/{slug}-fN.png # Gemini 2라운드 (multi-frame)

design/sprite/
  output{*}/{slug}/{action}.{png,json} # 후처리 결과
  output{*}/_master/{master}.png       # 카탈로그
  output{*}/_master/index.json         # 진입점

design/xaml/output/sample{N}/
  sprites/{slug}/...                   # 음악단 미러
  dance/{style}/{slug}.{png,json}      # 댄스단 미러
```

`{*}` 자리에 컬렉션 이름(없거나 `_dance`)을 일관되게 적용한다.

---

## 11. 비용·시간 가이드 (2026-06 기준)

| 작업 | 호출 수 | 비용 | 시간 |
|------|---------|------|------|
| 단일 포즈 batch (36명) | 36 + 1 재시도 | $1.44 | ~8분 |
| Multi-frame batch (36 × 4f) | 144 + ~9 재시도 | $5.96 | ~30분 |
| Multi-frame batch (19 × 8f) | 152 | $5.93 | ~29분 |
| Fix-pass (10~15 frame) | 10~15 + 0~3 재시도 | $0.40~$0.70 | 2~5분 |
| Stage 배경 3종 | 3 | $0.12 | 1분 |

---

## 12. 다음 액션 후보

- **Case S→W 파이프라인 강화**: 댄스단도 sample{N+1}에 자율 wave + 음역대 점프 적용
- **새 컬렉션 추가**: 컨셉아트(전사단·요리사단 등) → 동일 파이프라인 재실행, 도메인 명세만 desc로 갱신
- **자동 진단 강화**: `sprite-postprocess.py evaluate`에 head-dup heuristic(bbox 가로폭 anomaly) 추가
- **BiRefNet 도입**: chroma 잔여 완전 제거 → S3 자동 채점 만점 도달
