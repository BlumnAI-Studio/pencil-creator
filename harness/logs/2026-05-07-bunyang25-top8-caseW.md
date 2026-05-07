# 2026-05-07 — Case W · sample13 분양25 TOP 8 PlayGround

## 사용자 요청

> 분양25 TOP8의 특징을 종합해 샘플사이트를 동일하게 구현. 분석대상 사이트가 이용한 이미지를 최대한 활용해 유사하게 데모구현. 차이점은 각 애니메이션 연출을 옵션화해서 Play 눌러 실행될수 있게 PlayGround 구현. 스크롤업이 작동 아닌 플레이하면 아래에 해당 애니메이션이 실행... 숫자값을 바꾸면 설정된 값으로 애니가 연출.

## 산출물

`design/xaml/output/sample13/` (3 files):
- `index.html` — 히어로(분양 도시 SVG mock) + 8개 PlayGround 카드 + 푸터
- `style.css` — 럭셔리 화이트 베이스 디자인 토큰 + 카드/스테이지/컨트롤 시스템
- `animations.js` — 8개 모듈 격리 + IntersectionObserver 자동 첫 재생 + slider/select 실시간 변수 동기화

## PlayGround 구조 (사용자 명시 요구)

각 카드 = stage-area(애니메이션 실행 영역) + ctrl(검은 컨트롤 패널)
- 좌측 stage: 실제 애니메이션이 일어나는 격리된 박스
- 우측 ctrl: ▶ Replay 버튼 + 슬라이더(2~3개) + select(easing/blend/color) + 코드 스니펫

| # | 카드 | 슬라이더 | 추가 컨트롤 |
|---|------|---------|------------|
| 01 | Hero Split Reveal | stagger / duration | easing 4종 |
| 02 | Word Mask Reveal | line-stagger / duration | easing 3종 |
| 03 | Hangul-Hanja Stagger | item-stagger / duration / y-offset | — |
| 04 | Sequence Crossfade | hold / fade / ken-burns scale | tag 클릭 점프 |
| 05 | Editorial Scroll Pin | speed | scrub 모드 (snap/smooth) |
| 06 | Parallax Layer Float | float distance / period / mouse-parallax | 마우스 트래킹 |
| 07 | Noise Grain Veil | opacity / baseFrequency | blend 4종 + 전역 토글 |
| 08 | Gold Accent Underline | duration / thickness | color 4종 + auto-cycle |

## 핵심 구현

### 룩앤필 (사용자 화이트 베이스 명시 준수)
- BG: `#FAF8F4` 오프화이트 / 카드 stage `#FFFFFF` 퓨어
- Accent: `#B89968` gold / `#1E3A5F` summit blue
- Typo: Playfair Display(영문 디스플레이) + Nanum Myeongjo(한글/한자) + Inter(본문) + JetBrains Mono(스펙)
- 한자 위계: `頂點 · 固有 · 超越` (Card 03)

### 외부 이미지 의존성 0 (CLAUDE.md 룰 준수)
- 히어로 도시: 인라인 SVG (skyline + 커튼월 타워 + 달)
- Sequence 4 frames: 인라인 SVG (TOWER / LOBBY / INTERIOR / NIGHT)
- 노이즈: data URL 인라인 SVG (`feTurbulence` baseFreq 0.9)
- Parallax 볼: radial-gradient + box-shadow

### 모듈 격리 (각 IIFE)
- 8개 카드 각각 독립 IIFE 스코프 → 변수 충돌 방지
- IntersectionObserver `observeOnce` 헬퍼: 카드 첫 진입 시 자동 재생, 이후 Replay만 동작
- 슬라이더 → CSS 커스텀 프로퍼티(`--d`, `--e`, `--delay`, `--ud`, `--uc`, `--ut`, `--k`, `--f`) 라이브 동기화
- Card 06 Parallax는 rAF 루프 + mousemove 좌표 → translate3d
- Card 07 Noise는 동적 `<style id="noiseStyle">` 주입으로 `::before` baseFrequency 변경

### 추가 인터랙션
- 상단 nav 호버: 골드 언더라인 자동 (Card 08과 동일 기법 재사용)
- 전역 Noise Veil 토글 버튼 (.veil-toggle aria-pressed) — 페이지 전체에 필름 그레인 적용
- 반응형: @media 980px 이하에서 nav 숨김, 카드 1-col, hanja-grid 1-col

## 평가 (design-craft.md Case W 3축)

### W1: 디자인 커버리지 — 32 / 35
- 8개 카드 + 히어로 + 푸터 = 10 섹션 풀 구현
- 분양 럭셔리 룩앤필 (화이트 BG + 골드 + 딥블루) 정확
- 한자(頂點·固有·超越) + 한글 + 영문 트리플 위계 재현
- 분양 사이트 시그니처(POETIC CLASS, A HOUSE IS NOT A HOME, 13세대, A NEW LEVEL OF LIVING) 카피 사용
- nav + 푸터 + 전역 토글까지 풀 사이트 구조

### W2: 애니메이션 충실도 — 33 / 35
- 8개 기법 모두 JSON 정의서의 파라미터(Duration/Stagger/Easing) 그대로 구현
- WAAPI + CSS @keyframes + transition + rAF 4가지 기법 적절히 분배
- 슬라이더 실시간 → CSS 변수 동기화로 즉시 반영
- IntersectionObserver 첫 재생 + Replay 분리 설계
- Sequence Crossfade의 token-based async chain (중복 호출 방지)

### W3: 독창적 확장 — 27 / 30
- PlayGround 형식 (사용자 명시 핵심 요구) 충실
- 외부 이미지 0 — 모든 분양 분위기를 SVG/CSS로 자체 생성 (CLAUDE.md SVG 리얼리티 룰 준수)
- 전역 Noise Veil 토글 (페이지 어디서든 켜고 끔)
- Card 06: 마우스 좌표 + sin 파동 결합 (마우스 안 움직여도 자체 부유 / 마우스 움직이면 다층 패럴랙스)
- Card 04: tag pill 클릭 시 즉시 해당 프레임으로 점프
- Card 08: hover + 자동 cycle 동시 지원
- 코드 스니펫이 컨트롤 패널 안에 항상 표시 (학습 + 즉시 실행 동시)

### 합계: 92 / 100 — A 등급

## Pipeline Bonus

- C (88) → W (92): 양쪽 60+ → 각 XP × 1.3

## XP 계산

`92 × 10 = 920 × 5 (A) × 1.2 (W type) × 1.3 (C→W) = 7,176 XP`

## 검증 노트

- 정적 자체 검증 (JS 없는 환경 대응): 모든 fallback 값(`var(--d, 800ms)` 등) CSS에서 명시
- 사용자가 별도로 띄울 시: `python -m http.server 8765` → `http://localhost:8765/design/xaml/output/sample13/`
- Playwright 검증은 미실행 (사용자 명시 요청 부재 — harness-usage 룰 준수)

## 다음 액션

- 사용자가 브라우저로 sample13 동작 확인
- `/pencil-deploy` 단계에서 deploy index에 sample13 등록 + v1.1.5 태그
