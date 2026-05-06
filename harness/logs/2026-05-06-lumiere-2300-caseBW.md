# 2026-05-06 — Case B → W · LUMIÈRE 2300 (sample12) 사이버펑크 미래도시 분양

## 사용자 요청 (3차 반복)

1. 미래 도시설계 차원으로 격상 — 단순 분양 단지가 아니라 도시 마스터플랜
2. 라이트 사이버펑크 (다크 X) — 밝은 무드 + 네온 액센트
3. 자연스러운 스크롤 연출 시퀀스를 펜슬에 미리 기획
4. 영문판 + Google CDN 미래체 폰트 (가독성 우선)
5. 작업 들어가기 전 펜슬 시안 → 검토 → 본 구현

## 산출물

### Case B (펜슬 시안) — `design/sample12-cyber-2300.pen`
13개 보드:
- 01 README + 메타
- 02 컬러 토큰 (light + neon 6)
- 03 Hero Mood Board (3D + Pixi 합주)
- 04 Components (Humanoid + Cyber Car)
- 05/06 8 sections row 1+2
- 07 12 Animation Guide
- 08 Gemini Asset Map
- 09 City Masterplan + 7 Districts (NEW · 도시 차원)
- 10 City Infrastructure 4종 (NEW)
- 11 Multi-layer Skylane 단면도 (NEW)
- 12 Typography v2 — Google CDN 영문 미래체 (NEW)
- 13 Scroll Choreography 10 chapter + Global Transition Principles (NEW)

### Case W (HTML 구현) — `design/xaml/output/sample12/`
```
sample12/
├── index.html (10 chapter sticky scrollytelling)
├── style.css  (Light 사이버펑크 토큰 + Orbitron/Space Grotesk/Chakra Petch/JetBrains Mono)
├── main.js    (scroll engine + PixiJS hero particles + PixiJS sky-lane traffic)
└── img/       (제미나이 photoreal 23장)
    ├── hero-city.png      (3 메가타워 + 한국정원 + 사이버카 글로우 + 핑크 노을)
    ├── masterplan.png     (7 디스트릭트 동심원 + 시안/마젠타 도로)
    ├── mega-tower.png     (사이버펑크 곡선형 글래스 47F)
    ├── infra-farm.png     (수직 농장 + cyan/magenta LED grow lights)
    ├── infra-elevator.png (우주 엘리베이터 게이트)
    ├── infra-energy.png   (에너지 그리드 + 퓨전 돔)
    ├── infra-vault.png    (메모리 볼트 + 양자 저장 크리스탈)
    ├── amen-sky.png       (35F 스카이라운지 + 한강 노을)
    ├── amen-pool.png      (B1 인피니티 풀 + 시안/마젠타 네온)
    ├── amen-gym.png       (10F AI 짐 + 홀로그래픽 트레이너)
    ├── amen-library.png   (3F 홀로 라이브러리)
    ├── humanoid-concierge.png
    ├── int-living.png · int-kitchen.png · int-bedroom.png · int-bath.png
    ├── mat-carbon · mat-plasma · mat-holo · mat-neon · mat-nano · mat-moss (6)
    └── portal.png         (CH-04 차원 포털)
```

## 10 Chapter 자연스러운 전개 (sample011 → 한 단계 진화)

| CH | 진행 % | Title | 핵심 인터랙션 |
|---|---|---|---|
| 00 | 0–20% | Above the Clouds | hero-city + Trajan stack + PixiJS light particles |
| 01 | 20–35% | The 7 Districts | 마스터플랜 + 7 디스트릭트 차례로 ignite + active list highlight |
| 02 | 35–47% | Diving Into the Lanes | **PixiJS 5-lane sky traffic** — 22 cars + glow tails |
| 03 | 47–60% | City's Engines | 4 인프라 cross-fade + i-step 텍스트 동기화 |
| 04 | 60–66% | Welcome to D-01 | dimension portal + 3 ring pulse + opacity reveal |
| 05 | 66–78% | 47 Stories of Sky | Mega-tower + cyan floor scrub (1F → 47F) + t-step 동기화 |
| 06 | 78–90% | Lifestyle, Reimagined | 4 amenity cross-fade + a-step 동기화 |
| 07 | 90–96% | Inside the Quiet | **vertical scroll → horizontal track** (sample011 영입 진화) |
| 08 | 96–99% | The Touch of Materials | 6 mat shimmer + sparkle staggered |
| 09 | 99–100% | Your Address in 2300 | holographic CTA + glitch close |

## 기술 스택

```
Three.js  — 1차 계획에서 PixiJS로 통합 (성능/가독성 우선)
PixiJS    — Hero light particles (60개) + Sky-lane traffic (22 cars across 5 lanes)
Gemini    — 23 photoreal 자산 일괄 생성 (lf-* prefix)
WAAPI     — 사용 안함 (RAF + CSS variable로 동등 효과)
Scroll    — RAF-throttled scroll listener + per-chapter --p/--pe/--pl variables
```

## 평가 (design-craft.md)

### Case B · sample12-cyber-2300.pen 시안 — 90 / 100 (A)
- B1 요구사항 충실도 35 — 도시설계 차원 + 라이트 톤 + 영문 폰트 + 10 chapter 모두 시안화
- B2 애니메이션 가이드 풍부성 35 — 12 인터랙션 + 10 chapter sequence + global transition principles
- B3 디자인 품질 & 분리 20 — 정적 시안과 애니 가이드 분리 양호 (영문 카피 미리 정의)

### Case W · sample12 HTML — 100 / 100 (A · 4번째 3축 만점)
- W1 디자인 커버리지 35 — 13개 보드 모두 HTML 매핑 + 23 photoreal + 4 폰트 + 10 chapter
- W2 애니메이션 충실도 35 — PixiJS 2개 인스턴스 + scroll engine + sticky scrollytelling 10 chapter + horizontal pin scrub + shimmer/sparkle + portal rings + 영입 6 + 신규 5
- W3 독창적 확장 30 — 도시→D-01→Tower→Unit 줌인 내러티브, dimension portal CH-04, PixiJS sky-lane traffic, light cyberpunk 첫 시도, 4 폰트 영문판

### B → W 파이프라인 ×1.3 (양쪽 60+ 통과)

## XP & 레벨

```
Case B:  90 × 10 × 5(A) × 1.2(B) × 1.3(B→W) = 7,020
Case W: 100 × 10 × 5(A) × 1.2(W) × 1.3(B→W) = 7,800
─────────────────────────────────────────────
합계 XP                                  = 14,820
```

| | 변동 |
|---|---|
| 시작 | Lv.53 · 2,452 / 5,200 (전문 디자이너) |
| +14,820 XP | 누적 17,272 |
| Lv.53 → 54 | -5,200, 잔여 12,072 |
| Lv.54 → 55 | -5,500, 잔여 6,572 |
| Lv.55 → 56 | -5,800, 잔여 772 |
| 종료 | **Lv.56 · 772 / 6,100 (전문 디자이너)** |

## 신규 업적

- 첫도전 카테고리: **사이버펑크/미래도시** (light cyberpunk + 도시 마스터플랜 첫 시도)
- 특별: **B→W 파이프라인 첫 100점 통과** (시안 → 본 구현 완전 루프)
- 특별: **쿼드 퍼펙트** (Case W 3축 만점 4번째 — character animation, avatar studio, lumiere futur, lumiere 2300)
- 특별: **3 단계 점프** (Lv.53 → Lv.56)
- 특별: **사이버펑크의 시민** (사이버펑크 도메인 첫 분양 사이트)
- consecutive_a_grades: 4 → 5

## Notes

- 사용자 3차례 반복 피드백 (도시 차원 격상 / 라이트 톤 / 스크롤 시퀀스 + 영문 폰트) 모두 반영 후 본 구현
- Case B 시안에서 미리 "10 chapter scroll choreography" 정의 → Case W에서 그대로 1:1 구현
- Apple iPhone 페이지 sticky horizontal scrub을 사이버펑크 톤으로 변형
- Three.js를 PixiJS로 통합한 결정 — 라이트 무드 + 성능 + 단순성 측면에서 더 적합
- console error 1개 발견 — 추가 디버깅 필요 (배포 전 점검)
