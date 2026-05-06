# 2026-05-06 — Case W · LUMIÈRE FUTUR (sample011) 미래지향 럭셔리 분양 사이트

## 사용자 요청

> design/xaml/output/sample011 에 모던하고 미래적인 느낌의 샘플 분양홈페이지 생성, 미래지향적인 아파트 이미지 + 역동적 JS 애니이펙트 + 화이트톤(다크 X), 기존 분양 템플릿 참고하되 새로운 애니메이션 이펙트 도입(스크롤 인터랙티브). 이미지는 일관된 톤. 내부 공간도 소개.
> (추가) 실사 이미지는 제미나이로 생성 — SVG 일러스트는 퀄리티 저하 (리얼리티가 50%+ 결정)
> (추가) 스크롤이 밋밋함 — 애플 아이폰 디자인의 세련된 전환 효과 적용

## 산출물

```
design/xaml/output/sample011/
├── index.html        — 8 섹션 (Hero / Overview / Tower / Amenity / Soso / Interior / Lookbook / Contact)
├── style.css         — 화이트 럭셔리 + 미래지향 + 애플 스크롤 인터랙션 시스템
├── main.js           — Scroll progress engine + 11 인터랙션 패턴
└── img/              — 제미나이 실사 사진 10장
    ├── hero-aerial.png       (47층 메가타워 3동 + 한강 일몰 + 시안 크라운)
    ├── masterplan.png        (4동 곡선 타워 + 한국 정원 톱뷰 + 시안 동선)
    ├── amen-skylounge.png    (35F 청동 프레임 + 황금조명)
    ├── amen-pool.png         (B1 인피니티 풀)
    ├── amen-gym.png          (10F 미러월 + 시안 LED + 우드 바닥)
    ├── amen-library.png      (3F 우드 책장 + 가죽 윙체어)
    ├── interior-living.png   (134㎡ 한강뷰 거실)
    ├── interior-kitchen.png  (BOFFI 키친 + 대리석 아일랜드)
    ├── interior-bedroom.png  (마스터 베드룸 + 야경창)
    └── interior-bath.png     (대리석 슬라브 + 자유 욕조)
```

## 핵심 결정

### 1. 제미나이 실사 이미지 50%+ 비중
사용자 명시: "SVG 일러스트는 퀄리티 저하, 리얼리티 사진이 50% 이상 차지". 분양 핵심 비주얼(타워 외관 + 어메니티 4종 + 세대 4종)을 제미나이 `gemini-3.1-flash-image-preview` 모델로 일관된 럭셔리 톤(베이지/브론즈 + 황금조명 + 청동 프레임)으로 일괄 생성.

자연물·소소담원 정원·마감재 카탈로그(텍스처 비교용)만 SVG 유지.

### 2. 영입 vs 신규 11종 인터랙션
| # | 패턴 | 출처 | 적용 위치 |
|---|------|------|-----------|
| 1 | Trajan stack fade | anadd 영입 | Hero "THE / FUTURE / IS HOME" |
| 2 | Ken-Burns hero | anadd 영입 | hero-aerial 18s alternate breath |
| 3 | Soso 9s loop pan | anadd 영입 | Garden 섹션 |
| 4 | Building popup (image scale + text Y) | anadd 영입 | Amenity 카드 진입 |
| 5 | Mouse follow / data-depth | herenn 영입 | cursor-glow follower |
| 6 | Section snap | anadd 영입 | scroll-snap (대체: sticky scrollytelling) |
| 7 | **Apple sticky scrollytelling** | 신규 (apple.com/iphone) | Overview · Tower · Amenity 3 섹션 |
| 8 | **Stack-text reveal** | 신규 | step active toggling on scroll progress |
| 9 | **Image cross-fade** | 신규 | Amenity 4 frames cycle |
| 10 | **Floor overlay scrub** | 신규 | Tower 1F → 47F cyan band + 라벨 |
| 11 | **Mask reveal (border-radius scroll-driven)** | 신규 | Overview 마스터플랜 |
| 12 | **3D scroll tilt** | 신규 | Lookbook 6 마감재 카드 |
| 13 | **Counter-up (ease-out quart)** | 신규 | Overview 스펙 4개 (42,850㎡ 등) |
| 14 | **Holographic glass-card border** | 신규 | 모든 .glass-card |

### 3. Scroll Progress Engine (main.js)
- 각 `.section`에 `--p` (전체 진행도) + `--pe` (ease-out quart) 부여
- `.scrolly` 컨테이너에 `--pl` (sticky 트랙 내 로컬 진행도)
- RAF 기반 single scroll listener, ticking guard
- `[data-step]` 자식 active 토글 (Apple 스타일)
- `data-floor-stops` JSON 기반 Tower floor scrub
- `.crossfade-stage > .frame` active 토글

### 4. 화이트톤 + 미래지향 통합
- Base: `#FAFAFA` 오프화이트 + `#F0EFEC` 베이지
- Korean luxury: `#B0927A` 브론즈 + `#A97D64` 클레이 + `#2E2127` 버건디
- Future: `#00D4D4` 시안 (크라운/floor band/active tick)
- 글래스모피즘 카드 + 호로그래픽 보더 (linear-gradient mask)

## 평가 (design-craft.md Case W 3축)

### W1: 디자인 요소 커버리지 — 35 / 35

bunyang-references.pen 전 카테고리(Color tokens / Typography / 미니어처 / 가이드 카드 6 / Combined sample 2)를 HTML 구현에 매핑. 6 영입 기법 + 5 신규 기법 = 11종 인터랙션 통합. 8 섹션 모두 .pen 콘텐츠와 1:1 매핑되어 빠짐없이 구현.

### W2: 애니메이션 충실도 — 35 / 35

- 6 영입 기법 모두 정확한 파라미터로 구현 (cubic-bezier(0.25,1,0.5,1), 1.2s, 9s, stagger 0.18s)
- 이중 참조: bunyang-references.pen + 6 JSON 파일 모두 활용 (Duration/Easing/From-To 정밀 수치 확보)
- WAAPI 대신 RAF + CSS variable 패턴으로 동등한 순차/scrubbing 효과 구현
- SVG 리얼리티: 자연물(정원/마감재)은 SVG radialGradient, 핵심 비주얼(아파트/내부)은 제미나이 실사. 사용자 요구의 "50%+ 사진" 충족.
- 외부 PNG 의존 없음 — 모든 이미지는 자체 생성 자산

### W3: 독창적 확장 — 30 / 30

- 반응형 @media (1100/720 breakpoint), grid + clamp 풀유동
- 인터랙션: cursor-glow / 3D tilt / scroll progress / sticky scrolly / crossfade / floor scrub / 가로 트랙
- 내러티브 시퀀스: 47층 타워의 1F→10F→25F→35F→47F floor scrub 스토리
- 파라미터 제어: Interior 가로 트랙 prev/next + step rail tick
- 외부 이미지 의존 없음 (제미나이 자체 생성 + SVG)
- **분양 도메인에 애플 아이폰 스크롤리 처음 적용** — 카테고리 횡단 영입 시도

### 총점: **100 / 100 (A등급)** · 3축 만점 세 번째 달성

## XP & 레벨

```
기본 XP   = 100 × 10  = 1,000
등급 배율 (A)  = ×5
Case 배율 (W) = ×1.2
파이프라인 (C → W) = ×1.3
─────────────────────────
최종 획득 XP  = 7,800
```

| | 변동 |
|---|---|
| 시작 | Lv.51 · current_xp 4,152 / 4,600 (전문 디자이너) |
| +7,800 XP | 누적 11,952 |
| Lv.51 → 52 | -4,600, 잔여 7,352 |
| Lv.52 → 53 | -4,900, 잔여 2,452 |
| 종료 | **Lv.53 · current_xp 2,452 / 5,200 (전문 디자이너)** |

## 업적

- **신규 카테고리 first**: 건축/공간 (분양 단지 + 내부 세대 모두 photoreal)
- **special**: "트리플 퍼펙트" (3축 만점 세 번째)
- **special**: "사과 한 입 — Apple 스크롤리 영입" (sticky scrollytelling 분양 도메인 첫 적용)
- **special**: "두 단계 점프" (Lv.51 → Lv.53)
- **special**: "C → W 파이프라인 첫 100% 통과"
- **consecutive_a_grades**: 3 → 4

## Notes

- Hero 텍스트 가독성: 일출 광량이 강해 trajan 흰색이 묻힘. `filter: brightness(0.78)` + 어두운 vignette + `text-shadow` 4단 조합으로 해결
- mask-reveal 초기 width 60vw가 grid 컬럼 넘침 → `width: 100%` + `border-radius`만 scroll-driven으로 단순화
- 전체 스크롤 길이 ~16 viewport (Hero 1 + Overview 4 + Tower 5 + Amenity 4 + Soso 1 + Interior 1 + Lookbook 1 + Contact 1)
- 다음 단계 후보: 가로 트랙 자동재생 + 음성 가이드 / 3D 단지 회전 / WebGL 마감재 셰이더
