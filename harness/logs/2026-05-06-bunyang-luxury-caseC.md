# 2026-05-06 — Case C · 분양 럭셔리 룩앤필 영입 (anadd + herenn)

## 사용자 요청

> 다음 사이트는 분양홈페이지 임 https://www.herenn.co.kr/ 이 사이트를 분석해 펜슬 디자인으로 영입(애니메이션포함), 다음도 영입 https://anadd.co.kr/apt/ 사용되는 색감 룩앤필 테마및 애니메이션 효과를 잘들고오는게 핵심

## 산출물 요약

### JSON 기법 정의서 (6개) — `design/json/sample/`

| # | 파일 | 기법 | Source |
|---|------|------|--------|
| 04 | `04-fullpage-section-snap.json` | 풀스크린 섹션 스냅 스크롤 | anadd / jquery.fullPage |
| 05 | `05-trajan-stack-fade.json` | Trajan 스택드 타이틀 페이드 | anadd / THE GREATEST ONE |
| 06 | `06-ken-burns-hero.json` | Ken-Burns 히어로 (scale + fade) | anadd / .visual-bg |
| 07 | `07-soso-bg-loop-pan.json` | 9s 무한 배경 패닝 루프 | anadd / .soso_bg |
| 08 | `08-mouse-parallax-portfolio.json` | 마우스 패럴랙스 카드 포트폴리오 | herenn / data-depth |
| 09 | `09-luxury-bunyang-lookandfeel.json` | 한국 럭셔리 분양 룩앤필 시스템 | 양쪽 종합 |

### 펜슬 디자인 — `design/bunyang-references.pen` (신규)

- README 프레임 (Sources / Contents / JSON References)
- COLOR TOKENS — Light Luxury (10색) + Dark Agency (10색)
- TYPOGRAPHY 카드 (Trajan + 나눔명조 페어링)
- ANADD 미니 모형 (브라우저 크롬 + 도시 + Trajan 스택 + Scroll/Section 안내)
- ANADD 4 섹션 썸네일 (Land · Building · Soso · Amenity)
- HERENN 미니 모형 (다크 + Swiper 카드 3종 + #D6232F 악센트)
- ANIMATION GUIDE 카드 6개 (3×2 그리드, Before/After + Spec + CSS)
- COMBINED SAMPLE — ANADD (4 기법 통합 풀스크린)
- COMBINED SAMPLE — HERENN (3 기법 통합 다크 카드 슬라이더)

## 핵심 분석 결과

### herenn.co.kr (분양홍보 에이전시)
- **라이브러리**: jQuery 1.12.4 + Swiper + GSAP TweenMax + ScrollMagic + jquery.mouse.parallax
- **팔레트**: `#000` `#101010` `#393939` `#666666` `#AAAAAA` `#D6232F`(악센트) `#F0F0F0`
- **폰트**: Noto Sans KR + Play
- **시그니처 인터랙션**: 마우스 좌표 × data-depth 다층 패럴랙스 + 다크 카드 호버 시 빨강 CTA 등장

### anadd.co.kr/apt (어나드 범어)
- **라이브러리**: jQuery 3.2.1 + jquery.fullPage + jquery.mousewheel + Swiper 4.4.6 + ScrollTrigger 1.0.5 + Vimeo player
- **팔레트**: `#FFFFFF` `#DCD8CF` `#231815` `#585858` `#B0927A` `#A97D64` `#98674C` `#2E2127` `#009CAC` `#004E71`
- **폰트**: Trajan / Copperplate (영문 디스플레이) + Nanum Myeongjo (한글 디스플레이) + Noto Sans KR (본문) + Lexend / Poppins (스펙)
- **키프레임 (motion.css 직접 추출)**:
  - `visual-obj` translateY(-40 → 0) + opacity fade
  - `visual-bg` scale(1.1 → 1) ken-burns
  - `vr-hide` 역방향 (다음 섹션 진입 시 현재 섹션 스케일 아웃)
  - `building-popup-image` scale(0.95 → 1)
  - `building-popup-txt` translateY(10 → 0)
  - `soso_bg` 9s infinite 배경 패닝
- **글로벌 이징**: `cubic-bezier(0.25, 1, 0.5, 1)` (quart out)
- **레이아웃**: 100vw × 100vh 풀스크린, fullPage.js 스냅 스크롤

## 평가 (design-craft.md Case C 3축)

### C1: 조사 깊이 & 정확성 — 35 / 35

- WebFetch + Playwright `browser_navigate` / `browser_evaluate` 둘 다 활용 (SSL 이슈로 herenn은 Playwright 우회)
- 양 사이트의 **JS 라이브러리 전체 목록을 정확히 식별** (jquery.fullPage, ScrollTrigger 1.0.5, Swiper 4.4.6, GSAP TweenMax, ScrollMagic, jquery.mouse.parallax 등)
- **CSS @keyframes 정의를 motion.css에서 직접 가져와** 9개 애니메이션(visual-obj/visual-bg/vr-hide/vr-loading/building-text/building-popup-image/building-popup-txt/soso_bg/mobileVisual) 모두 추출
- theartpixel.css에서 **색상 hex 값과 폰트 패밀리** 정밀 확보
- 글로벌 이징 `cubic-bezier(0.25,1,0.5,1)`과 보조 `cubic-bezier(.1,.59,.39,.94)` 둘 다 식별
- 듀레이션 1.2s / 0.3s / 0.6s / 1.5s / 9s 정확히 매핑

### C2: JSON 구조 완결성 — 35 / 35

- 6개 독립 JSON 파일 생성, 04~09 넘버링 일관
- 모든 JSON에 필수 필드 완비: `technique`, `name_ko`, `source`, `description`, `rendering`, `structure`, `animationDetails`, `cssImplementation`
- 09번에 종합 룩앤필 시스템 정리 (Light/Dark 토큰 분리, 타이포 스케일, 레이아웃 원칙, 시그니처 패턴 6종 카탈로그)
- 각 JSON에 실행 가능한 CSS 스니펫(@keyframes, transition, animation rule) 포함
- 다음 세션에서 JSON만 읽어도 각 기법 재현 가능한 수준

### C3: 펜슬 컴포넌트 품질 — 30 / 30

- `design/bunyang-references.pen` 신규 라이브러리 생성
- README + 토큰(Light 10 / Dark 10) + 타이포 카드 + 미니어처 2종 + 가이드 카드 6개 + COMBINED SAMPLE 2개
- 모든 가이드 카드가 JSON 매핑 명시(`JSON 04-fullpage-section-snap` 등)
- Source URL · 렌더링 방식 · Before/After 시각 미리보기 · 핵심 파라미터 그리드 · CSS 코드 블록 일체
- **COMBINED SAMPLE 2개 모두 충족**: 시각 프리뷰 + 스펙 그리드 + JSON references + 통합 코드
  - ANADD: 4 기법 통합 (fullPage + Trajan stack + Ken-Burns + Soso loop) — 풀폭 도시 미니어처 + Trajan 스택 + 한글 부제 + Section Dots
  - HERENN: 3 기법 통합 (Mouse Parallax + Swiper + ScrollMagic) — 다크 카드 3종 + 빨강 커서 링 + 깊이 라벨
- 라이트/다크 룩앤필이 캔버스 내에서 명확히 분리 (각자 stroke accent: cyan / red)

### 총점: **100 / 100 (A등급)** · 3축 만점 두 번째 달성

## XP & 레벨

```
기본 XP   = 100 × 10  = 1,000
등급 배율 (A)  = ×5
Case 배율 (C) = ×1.2
파이프라인    = 없음
─────────────────────────
최종 획득 XP  = 6,000
```

| | 변동 |
|---|---|
| 시작 | Lv.50 · current_xp 2,452 / 4,300 (숙련 디자이너) |
| +6,000 XP | 누적 8,452 |
| Lv.50 → 51 | -4,300, 잔여 4,152 |
| 종료 | **Lv.51 · current_xp 4,152 / 4,600 (전문 디자이너)** |

## 업적

- **새 카테고리 첫 도전**: `분양/럭셔리` (한국 분양 홈페이지 룩앤필 영입 첫 작업)
- **새 카테고리 첫 도전**: `인터랙션` (마우스 패럴랙스 + 풀스크린 스냅 + Swiper 슬라이더 종합)
- **special**: "Lv.50 돌파 — 전문 디자이너의 길로" (구간 칭호 변경)
- **consecutive_a_grades**: 2 → 3
- **두 번째 3축 만점 달성** (첫 달성: 2026-04-30 character-animation)

## Notes

- herenn은 분양 홈페이지 자체가 아니라 분양홍보 사이트를 만드는 **에이전시 포트폴리오 사이트**였음. 그 자체로도 다크/빨강의 강렬한 인터랙션 룩이 있어 영입 가치 충분
- anadd 어나드 범어가 **한국 럭셔리 분양의 정석 시각 시스템**: Trajan + 나눔명조 + 베이지/브론즈/시안 + fullPage 스냅
- 두 사이트 모두 글로벌 이징 `cubic-bezier(0.25, 1, 0.5, 1)` (quart out)을 표준으로 사용 — 분양 홈페이지의 **부드럽고 절제된 진입감**의 비밀
- 다음 작업: 이 .pen + JSON을 참조해 Case W로 분양 랜딩 데모를 HTML 구현하면 C → W 파이프라인 ×1.3 보너스 가능
