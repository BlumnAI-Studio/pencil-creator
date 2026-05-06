# Case A — Character Animation (CAT17 신규)

> 날짜: 2026-04-30
> 케이스: A (Template) — WPF 조사 → wpf-animation.pen 보강
> 대상: design/wpf-animation.pen (CAT17 신규 카테고리 + 6 카드 + COMBINED SAMPLE)
> 트리거: "WPF에서 캐릭터 애니메이션 조사해 펜슬영입"

---

## 1. 작업 요약

기존 CAT1~16에 부재했던 **캐릭터 애니메이션** 컨텍스트를 신규 카테고리(CAT17)로 도입.
Disney 12 Principles of Animation 패러다임 + WPF Storyboard 매핑을 동시에 다루는 6개 카드 + 통합 SAMPLE 프레임.

### 산출물

| 항목 | 위치 | 설명 |
|------|------|------|
| 신규 카테고리 | `design/wpf-animation.pen` § CAT17 | Character Animation 캐릭터 애니메이션 (#F472B6 accent) |
| Card 17-1 | wpf-animation.pen § CAT17 row1 | Sprite Sheet Walk Cycle (4프레임 시각화) |
| Card 17-2 | wpf-animation.pen § CAT17 row1 | Squash & Stretch (normal/stretch/squash 3상태) |
| Card 17-3 | wpf-animation.pen § CAT17 row1 | Idle Breathing Loop (캐릭터 + 호흡 화살표) |
| Card 17-4 | wpf-animation.pen § CAT17 row2 | Eye Blink Sequence (open/closed 양안) |
| Card 17-5 | wpf-animation.pen § CAT17 row2 | Head Tracking (head + cursor sight line) |
| Card 17-6 | wpf-animation.pen § CAT17 row2 | Anticipation & Follow-Through (4단계 액션 아크) |
| COMBINED SAMPLE | wpf-animation.pen § "Pixel Hero Animation Suite" | 4기법 통합 (Walk + Breath + Squash + Blink) |
| XAML 샘플 | `design/xaml/sample/39~44.xaml` | 6개 독립 실행 가능 Window |
| 조사 히스토리 | `design/xaml/research-history.md` § "7차 조사" | CAT17 6개 기법 + COMBINED SAMPLE 메타 |

---

## 2. 3축 평가 (Case A)

### 축 A1: 리서치 신규성 & 비중복성 — **35 / 35**

| 평가 항목 | 결과 |
|-----------|------|
| 기존 CAT1~16 중 캐릭터 애니메이션 부재 | ✅ 신규 카테고리 |
| 신규 기법 수 | 6개 (Walk Cycle / Squash & Stretch / Idle Breathing / Eye Blink / Head Tracking / Anticipation & Follow-Through) |
| 새 패러다임 도입 | ✅ Disney 12 Principles of Animation |
| 새 WPF 속성 조합 | ✅ ImageBrush.Viewbox + RectAnimationUsingKeyFrames (스프라이트 시트 — 기존에 없던 조합) |

**근거:** 기존 카테고리는 컨트롤(CAT1)/피드백(CAT2)/네비(CAT3)/장식(CAT4)/3D Transform(CAT5)/Path(CAT6)/Text(CAT7)/Interactive(CAT8)/Loading(CAT9)/Ambient(CAT10)/Celebration(CAT11)/Spring(CAT12)/Cyber(CAT13)/Peace(CAT14)/Space(CAT15)/RPG Hero(CAT16) — 캐릭터 1체에 적용되는 12 Principles 기반 애니메이션은 미커버. 6개 기법 모두 신규 패러다임.

### 축 A2: 시각화 표현력 — **35 / 35**

| 평가 항목 | 결과 |
|-----------|------|
| Before→After 시각화 | ✅ 모든 카드 다단계 상태 표현 |
| 17-1 표현 | 4프레임 보행 시퀀스 (좌→우 발 위치 변화) |
| 17-2 표현 | normal / stretch (세로 길어짐) / squash (가로 납작) 3상태 |
| 17-3 표현 | 정지 캐릭터 + 호흡 ↕ 화살표 + 약한 ghost echo (확대 상태) |
| 17-4 표현 | open eyes (원형 + 동공) ▶ closed eyes (얇은 라인) |
| 17-5 표현 | 머리 + 동공 + cursor + 점선 시선 추적 |
| 17-6 표현 | 4단계 액션 아크 (anticipate→dash→overshoot→settle) + tilt 변화 |
| 일관성 | #F472B6 핑크 악센트 + JetBrains Mono 폰트 + #1E293B 카드 배경 통일 |

### 축 A3: 기술 메타 완결성 — **30 / 30**

| 평가 항목 | 결과 |
|-----------|------|
| .xaml 샘플 파일 | ✅ 6개 (39~44, 독립 실행 가능 `<Window>`) |
| research-history.md 출처 기록 | ✅ 7차 조사 섹션 추가 (Microsoft Learn + Disney Wikipedia + XamlFlair + moldstud) |
| WPF 속성 정확성 | ✅ ImageBrush, RectAnimation, ScaleTransform, SineEase, SplineDoubleKeyFrame, RotateTransform 등 정확 |
| **COMBINED SAMPLE** | ✅ "Pixel Hero Animation Suite" — 시각 프리뷰 + 스펙 그리드 + XAML 참조 + WPF/CSS 코드 통합 |

**총점: 100 / 100 (A등급, 만점)** 🎯

---

## 3. WPF → Web 매핑 테이블 (Case W 진입 시 참조)

| WPF 기법 | Web 매핑 | 비고 |
|---------|---------|------|
| ImageBrush.Viewbox + RectAnimation (Walk Cycle) | CSS `background-position` + `steps()` 또는 WAAPI keyframes | sprite sheet PNG 또는 CSS sprite |
| ScaleTransform non-uniform (Squash) | `transform: scale(sx, sy)` + `cubic-bezier(.4,0,.2,1)` | RenderTransformOrigin → `transform-origin` |
| SineEase + AutoReverse + Forever (Breathing) | `animation: ease-in-out alternate infinite` | 또는 WAAPI `direction:'alternate'` |
| LinearDoubleKeyFrame (Eye Blink) | WAAPI `[{transform:'scaleY(1)'},{transform:'scaleY(.05)'},...]` | `setInterval(3000)`로 주기 깜빡임 |
| MouseMove + RotateTransform (Head Tracking) | `mousemove` + `Math.atan2()` + `transform: rotate()` | damping factor 동일 |
| SplineDoubleKeyFrame (Anticipation/Follow-Through) | WAAPI Promise chain 또는 multi-stage `@keyframes` | KeySpline → `cubic-bezier()` |

---

## 4. RPG 결과

```
획득XP = 1000 (base) × 5 (A등급) × 1.2 (Case A) = 6,000 XP
```

| 항목 | 값 |
|------|-----|
| 이전 레벨 | Lv.47 (1552 / 4000) |
| 획득 XP | +6,000 |
| 신규 누적 XP at Lv.47 | 1552 + 6000 = 7552 |
| 레벨업 발생 | ✅ Lv.47 → **Lv.48** |
| 차감 후 잔여 XP | 7552 - 4000 = **3552** |
| 다음 레벨 필요 XP | 4100 (Lv.48 → Lv.49) |
| 총 누적 XP | 81408 + 6000 = **87,408** |
| 칭호 | "숙련 디자이너" (변경 없음, 26~50 구간) |

### 신규 업적

- 🆕 **"가슴이 웅장해진다"** — 3축 만점 100점 첫 달성!
- 애니메이션 카테고리 count 3 → **4** (다음 milestone "5-regular" 1회 남음)
- consecutive_a_grades: 0 (Verdana Health B등급으로 끊김) → **1** 재시작

---

## 5. 후속 가능 워크플로우

1. **Case W 직통**: COMBINED SAMPLE의 "Pixel Hero Animation Suite" 프레임을 참조하여 게임풍 캐릭터 페이지 HTML 즉시 구현 가능 → A→W ×1.2 보너스
2. **Case B 활용**: 기존 프로젝트(예: publisher-app) 사이드바 캐릭터 마스코트로 활용 → A→B ×1.2
3. **CAT17 확장**: Lip Sync (입모양 동기화) / Skeletal Bone Chain / Frame-by-Frame Mouth Shape 등 추가 카드로 확장 여지
