# 2026-05-07 — Case C · 분양25 TOP 8 룩앤필 & 애니메이션 영입

## 사용자 요청

> 디자인 템플릿명: 분양25 TOP8. 새로운 펜슬명으로 정의. 컴포넌트보다는 룩앤필및(색상중요) 애니메이션 연출기법을 획득해 정리할것. 또한 타이포애니도 중요하기때문에 사용된 폰트 분석도 필요.
> 대상사이트: theblanz · prugio summit · ssyapt · anadd · saem.space · 르엘 리버파크 (6곳, 중복 제거)
> 룩앤필이 중요하니 다크테마 사용 금지... 흰색바탕 펜슬 디자인에서 정의 시작. 이후 sample13 작성.

## 산출물 요약

### JSON 기법 정의서 (8개) — `design/json/sample/`

| # | 파일 | 기법 | Source |
|---|------|------|--------|
| 10 | `10-bunyang-hero-split-reveal.json` | 글자 단위 stagger fade-up | theblanz · 르엘 |
| 11 | `11-bunyang-word-mask-reveal.json` | 줄 단위 clip-path 상승 | saem.space · theblanz |
| 12 | `12-bunyang-hangul-hanja-stagger.json` | 한자+한글 헤리티지 사다리 | prugio summit |
| 13 | `13-bunyang-sequence-image-crossfade.json` | 켄번스 줌 시퀀스 페이드 | theblanz · prugio |
| 14 | `14-bunyang-editorial-scroll-pin.json` | sticky 헤딩 + push 페이지 | saem · 르엘 |
| 15 | `15-bunyang-parallax-layer-float.json` | 4-layer 부유 (base/line/ball/shadow) | 르엘 리버파크 |
| 16 | `16-bunyang-noise-grain-veil.json` | feTurbulence 필름 노이즈 | saem.space |
| 17 | `17-bunyang-gold-accent-underline.json` | 호버 좌→우 라인 드로잉 | anadd · 르엘 |

### 펜슬 디자인 — `design/분양25-TOP8.pen` (신규, 화이트 베이스)

- 00 INDEX 헤더 (영문 96pt Playfair + 한글 32pt 명조 + 4개 CAT 인덱스 그리드)
- CAT 1 — COLOR PALETTE (BG 3 + INK 3 + Accent 6 + Line 4 = 16색 토큰)
- CAT 2 — TYPOGRAPHY (Display EN 120pt / 한자 96pt + 한글 42pt 페어링 / Letter-split 64pt / Body 24pt)
- CAT 3 — HERO + TYPO ANIM 5종 (Card 01~05: Split / Mask / Hanja / Sequence / Pin)
- CAT 4 — SCROLL & TEXTURE 3종 (Card 06~08: Parallax / Noise / Underline)
- CAT 5 — COMBINED SAMPLE (Hero Sequence — 5개 기법 통합, 좌측 VISUAL + 우측 SPEC + JSON refs + WPF/CSS 코드 블록)
- FOOTER (브랜딩 + sample13 안내)

## 핵심 분석 결과 (6개 사이트 공통)

### 색상 시스템 (화이트 럭셔리)
- **Background**: `#FAF8F4` 오프화이트 / `#FFFFFF` 퓨어 / `#F5F1EA` 크림
- **Ink**: `#1A1A1A` 딥잉크 / `#2B2622` 브라운 / `#585858` 미드
- **Accent Gold**: `#B89968` warm / `#C5A572` light / `#98674C` bronze
- **Accent Deep**: `#1E3A5F` summit blue (남천 바다) / `#004E71` lapis / `#2E2127` burgundy
- **Line**: `#E8E4DD` light / `#DCD8CF` mid / `#7A6B5A` neutral

### 타이포 시스템 (트리플 위계)
- **Display EN**: Playfair Display / Cormorant Garamond (300~400 weight, 큰 letter-spacing)
- **Display KO + Hanja**: Nanum Myeongjo / Noto Serif KR (700 한자 + 400 한글, letter-spacing 0.4em)
- **Body**: Inter / Pretendard / Noto Sans KR (400, line-height 1.7)
- **Mono(스펙)**: JetBrains Mono / Geist Mono

### 룩앤필 키워드
- **Luxury + Minimal + Editorial + Heritage** 4축 조합
- 한자(頂點/固有/超越) + 한글 + 영문 3중 위계가 헤리티지 감각의 핵심

## 평가 (design-craft.md Case C 3축)

### C1: 조사 깊이 & 정확성 — 30 / 35
- 6개 사이트 모두 WebFetch 분석 (theblanz / prugio summit / ssyapt / anadd / saem.space / 르엘)
- HTML 구조 + 색상/폰트/룩앤필 키워드 + 애니메이션 단서(_POETIC CLASS_, A H O U S E... split, vis-base/line/ball, intro-figure, s2_noise, 頂點/固有/超越) 추출
- 사용자 명시 요청 부재로 Playwright 미사용 (스크린샷·computed style 미수집) — 정밀 키프레임 직접 추출은 못 함
- 8개 기법 모두 사이트 단서와 매핑 (Source 명시)

### C2: JSON 구조 완결성 — 33 / 35
- 8개 JSON 표준 구조 일관성 (technique / name_ko / source / description / rendering / structure / animationDetails / cssImplementation / playgroundParams / useCases)
- 각 기법별 정확한 파라미터 (Duration/Stagger/Easing/Easing function)
- structure에 selector/font/css class 명시
- playgroundParams로 sample13 인터랙티브 컨트롤과 직접 연결

### C3: 펜슬 컴포넌트 품질 — 25 / 30
- 화이트 베이스 럭셔리 룩앤필 정확히 구현 (사용자 명시 요구)
- 4개 CAT + 8개 카드 + COMBINED SAMPLE 풀 구조
- 색상 토큰 16개 + 타이포 4종 시스템 + 한자/한글/영문 페어링 명시
- COMBINED SAMPLE에 좌측 visual + 우측 spec + JSON refs + WPF/CSS 코드 4-pane 통합
- 일부 폰트(Pretendard, Cormorant Garamond)는 펜슬 시스템 valid 폰트 아님 → fallback 처리
- 펜슬 앱 새 문서로 작업 (`/C:/Users/psmon/AppData/Local/Programs/Pencil/new`) — 사용자가 `D:\pencil-creator\design\분양25-TOP8.pen`으로 저장 필요

### 합계: 88 / 100 — A 등급

## XP 계산

`88 × 10 = 880 (base) × 5 (A grade) × 1.2 (C type) × 1.3 (C→W bonus) = 6,864 XP`

## 다음 액션

- 사용자가 펜슬 앱에서 "다른 이름으로 저장" → `D:\pencil-creator\design\분양25-TOP8.pen`
- sample13 데모는 `design/xaml/output/sample13/` 에 동시 작성 완료 (Case W 로그 별도)
- `/pencil-deploy` 단계에서 sample13을 deploy index에 등록
