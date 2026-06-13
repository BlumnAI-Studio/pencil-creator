# Pencil Creator

[![Pencil Creator 시연 영상](https://img.youtube.com/vi/wx6UsD48zXs/maxresdefault.jpg)](https://www.youtube.com/watch?v=wx6UsD48zXs)

> ▶ 이미지를 클릭하면 **PencilCreator 시연 영상**이 재생됩니다.

![Pencil Creator](design/img/intro.png)

**Look & Feel + Animation First Design** ― 웹 애플리케이션을 만들기 전에, 룩앤필과 애니메이션을 먼저 디자인하고 검증하는 Claude Code 프로젝트
11종(지속발굴)의 애니메이션가능 컨트롤을 기본 제공하며 이 디자인 하네스를 이용하면 위와같은 컨트롤을 프롬프트만으로 발굴하고 추가할수 있습니다.

# MS Blend for Visual Studio 

![Pencil Creator](design/img/blend-xaml.png)

펜슬(Pencil)은 정의 파일만으로도 애니메이션 웹 구현이 가능합니다.

선택사항으로 **Blend 툴**을 추가 활용하면  
애니메이션의 세부적인 움직임을 더욱 직접적으로 조절할 수 있습니다.
Pencil의 **타임라인 & 스토리보드 기능을 보완하는 역할**을 합니다.

---

## Pencil 디자인 파일 (.pen)

이 프로젝트의 디자인 산출물은 [Pencil](https://pencil.elpass.app/) 에디터의 `.pen` 파일로 관리됩니다.
아래 파일을 다운로드하여 Pencil 에디터에서 열면 애니메이션 템플릿과 프로젝트 디자인을 확인할 수 있습니다.

| 파일 | 설명 | 다운로드 |
|------|------|----------|
| WPF 애니메이션 템플릿 | 12개 CAT, 40개+ 기법 카드 라이브러리 | [`design/wpf-animation.pen`](design/wpf-animation.pen) |
| Publisher App 디자인 | 웹 ZIP 퍼블리셔 앱 (4화면 + 애니메이션 가이드 12카드) | [`projects/design/publisher-app.pen`](projects/design/publisher-app.pen) |

---

## Design-First 컨셉

이 프로젝트의 핵심 철학은 **"코드 전에 디자인, 정적 디자인 전에 애니메이션 설계"** 입니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANIMATION-FIRST DESIGN                       │
│                                                                 │
│  1. WPF 애니메이션 조사     DoubleAnimation, ScaleTransform,    │
│     (Case A)               Easing, Storyboard 패턴 수집        │
│           ↓                                                     │
│  2. 애니메이션 템플릿       wpf-animation.pen                   │
│     라이브러리 구축         10개 CAT, 37개 기법 카드             │
│           ↓                                                     │
│  3. 프로젝트 디자인         정적 룩앤필 화면                     │
│     (Case B)               + 애니메이션 가이드 (분리!)          │
│           ↓                                                     │
│  4. HTML 구현              CSS/JS 애니메이션으로 변환            │
│     (Case W)               WPF → CSS 매핑 규칙 적용             │
│           ↓                                                     │
│  5. 하네스 평가 & 개선     3축 채점 + RPG 경험치                 │
│           ↓                                                     │
│        반복                                                     │
└─────────────────────────────────────────────────────────────────┘
```

**왜 애니메이션을 먼저 설계하는가?**

- 애니메이션은 나중에 덧붙이면 어색해진다. 처음부터 **상태 전환(Before→After)**을 설계해야 자연스러운 UX가 된다.
- WPF Storyboard 패턴은 애니메이션의 속성(대상, 시간, 이징)을 명시적으로 정의하는 최고의 레퍼런스다.
- 정적 디자인과 동적 정의를 **분리**하면, 룩앤필 변경 시 애니메이션을 독립적으로 유지할 수 있다.

---

## Application Layout — 프로젝트 디자인 산출물

### Publisher App (웹 ZIP 퍼블리셔)

ZIP 파일을 업로드하여 웹사이트를 게시·관리하는 애플리케이션.

**정적 디자인 (4개 화면):**

| 화면 | 주요 구성 |
|------|----------|
| Dashboard | 통계 카드 4개 + 게시 사이트 테이블 |
| Upload | 드래그&드롭 영역 + 프로그레스바 + 완료 목록 |
| Publish | 폼(이름/게시자/소개/파비콘) + 유효검사 + 게시 버튼 |
| View Sites | 6개 사이트 카드 그리드(3x2) + 새창 열기/삭제 |

**애니메이션 가이드 (4개 카테고리, 12개 카드):**

| 카테고리 | 카드 | WPF 기법 | 적용 대상 |
|----------|------|---------|----------|
| CAT-A Dashboard | Counter Roll-Up | DoubleAnimation + CubicEaseOut | 통계 값 텍스트 |
| | Staggered Row Entrance | TranslateY + Opacity Stagger | 테이블 행 |
| | Skeleton Shimmer | GradientStop + Forever | 로딩 상태 |
| CAT-B Upload | Dropzone Pulse Glow | Opacity + Shadow AutoReverse | 드롭존 테두리 |
| | Progress Bar Gradient | Width DoubleAnimation | 프로그레스 Fill |
| | File Card Slide-In | TranslateX + ElasticEase | 완료 파일카드 |
| CAT-C Publish | Floating Label Input | Y + Scale + ColorAnimation | 입력 필드 |
| | Validation Stagger Check | Scale + BounceEase | 검증 항목 |
| | Publish Button Ripple | Ellipse Scale + Opacity | 게시 버튼 |
| CAT-D View Sites | Card Hover Scale + Lift | ScaleTransform + Shadow | 사이트 카드 |
| | Gradient Background Shift | PointAnimation + Forever | 카드 썸네일 |
| | Delete Bounce Shrink | BackEaseIn + Opacity | 삭제 동작 |

파일: `projects/design/publisher-app.pen`

---

## WPF 애니메이션 조사 기법

### 조사 → 시각화 파이프라인

WPF의 Storyboard/DoubleAnimation/Transform 패턴을 조사하여, Pencil 디자인 카드로 **정적 시각화**합니다.

```
WebSearch XAML 예제
    ↓
핵심 속성 추출
  - TargetProperty (Opacity, ScaleX, TranslateX...)
  - Duration, BeginTime
  - EasingFunction (CubicEaseOut, ElasticEase, BounceEase...)
  - RepeatBehavior, AutoReverse
    ↓
Pencil 카드 생성
  ┌──────────────────────────────┐
  │ 1-1  FLOATING LABEL TEXTBOX │  ← 번호 + 제목
  │                              │
  │ Focus → Label Y↑18px        │  ← 동작 설명
  │ Scale 75%, Color transition  │
  │                              │
  │ ┌─────────┐  →  ┌─────────┐ │  ← Before → After
  │ │Username │     │Username │ │
  │ │         │     │█        │ │
  │ └─────────┘     └─────────┘ │
  │                              │
  │ <DoubleAnimation             │  ← XAML 코드
  │   TargetProperty="Y"        │
  │   To="-18" Duration="0.2"/> │
  └──────────────────────────────┘
```

### 현재 템플릿 라이브러리

| 자료 | 경로 | 규모 |
|------|------|------|
| 애니메이션 템플릿 | `design/wpf-animation.pen` | 12개 CAT, 40개+ 카드 |
| XAML 샘플 | `design/xaml/sample/*.xaml` | 27개 독립 실행 파일 |
| 조사 이력 | `design/xaml/research-history.md` | 20개 출처/기법 기록 |
| **WPF App (Blend용)** | `design-wpf-app/` | **27개 UserControl (Blend 타임라인 편집 가능)** |

**카테고리 목록:**

| CAT | 주제 | 대표 기법 |
|-----|------|----------|
| 1 | Data Input Controls | Floating Label, ComboBox, Toggle |
| 2 | Feedback & Notification | Snackbar, Progress Bar, Badge |
| 3 | Navigation & Transitions | Page Transition, Tab Slide, Hamburger Morph |
| 4 | Decorative & Background | Gradient BG, Particle Dots, Pulsing Glow |
| 5 | 3D Transform & Shape Morph | Flip Card, Morphing, Elastic Spring |
| 6 | Path & Trajectory | Path Follower, Parallax, Drag & Drop |
| 7 | Text & Sequential | Typewriter, Marquee, Staggered List |
| 8 | Interactive UI Controls | Ripple Button, Accordion, Tooltip |
| 9 | Data Visualization & Loading | Skeleton Shimmer, Circular Progress, Bar Chart |
| 10 | Ambient & Decorative FX | Wave Ripple, Breathing Pulse, Marching Ants |
| 11 | Celebration & Advanced | Confetti Burst, Zoom/Pinch, Animated Tooltip |
| 12 | Spring & Nature Particle | Cherry Blossom Fall, Petal Scatter, Breeze Sway |

---

## 3-Case Harness 워크플로우

### Case A: WPF 템플릿 보강

```bash
> "wpf-템플릿조사 후 템플릿보강해"
> "WPF Elastic/Spring 효과를 조사해서 wpf-animation.pen에 추가해줘"
```

WebSearch로 WPF XAML을 직접 조사하여 `design/wpf-animation.pen`에 카드를 추가합니다.

| 평가 축 | 만점 | 핵심 |
|---------|------|------|
| A1 리서치 신규성 | 35 | 기존 중복 없이 새 기법 추가했나 |
| A2 시각화 표현력 | 35 | Before→After 전환이 직관적인가 |
| A3 메타 완결성 | 30 | XAML 코드와 출처가 정확한가 |

### Case B: 프로젝트 디자인 (Design-First)

```bash
> "wpf-animation 이펙트를 참고해 퍼블리셔 앱을 펜슬로 디자인해줘"
> "wpf-animation 참고해서 쇼핑몰 관리자 페이지 디자인해줘"
```

wpf-animation.pen을 **참고 라이브러리**로 활용하여, 정적 룩앤필 + 애니메이션 가이드를 **분리 설계**합니다.

| 평가 축 | 만점 | 핵심 |
|---------|------|------|
| B1 요구사항 충실도 | 35 | 요구된 페이지/기능이 모두 디자인되었나 |
| B2 애니메이션 가이드 풍부성 | 35 | 다양한 WPF 기법 매핑 + Target 명시 |
| B3 디자인 품질 & 분리 기법 | 30 | 룩앤필 일관성 + 정적/동적 분리 |

### Case W: HTML 구현

```bash
> "펜슬 참고해서 HTML 만들어줘"
> "publisher-app.pen 디자인을 웹으로 구현해줘"
```

.pen 파일의 정적 디자인 + 애니메이션 가이드를 HTML/CSS/JS로 변환합니다.

| 평가 축 | 만점 | 핵심 |
|---------|------|------|
| W1 디자인 커버리지 | 35 | .pen 요소를 얼마나 반영했나 |
| W2 애니메이션 충실도 | 35 | 애니메이션 가이드를 실제 구현했나 |
| W3 독창적 확장 | 30 | 디자인에 없는 인터랙션 추가했나 |

### Case S: 스프라이트 애니메이션 (컨셉아트 / 영상 → 스프라이트 시트)

```bash
> "이 컨셉아트로 스프라이트 시트 만들어줘"
> "이 유튜브 가수 동작 분석해서 vocal-ex 스프라이트로 만들어줘"
```

컨셉아트 **또는 실제 영상의 인물 동작**을 배경 투명, 게임/웹 즉시 활용 가능한
스프라이트 시트(Aseprite Hash JSON)로 만듭니다. 이미지 프로바이더 2종 지원 —
**Gemini**(배치·시드 고정 일관성)와 **OpenAI gpt-image-2**(컨셉 reference 일관성, 시드 불필요).
실제 영상은 `video-motion-analysis` 스킬(yt-dlp + ffmpeg 콘택트 시트)로 먼저 분석해
동작 어휘를 추출한 뒤 스프라이트 키프레임으로 매핑합니다.

**대표 사례 — `vocal-ex`** (FIFA 월드컵 'DNA' 무대 가수):
가수의 47–55초 클로즈업 시퀀스를 분석하고, gpt-image-2로 캐릭터 컨셉을 잡은 뒤
14프레임(idle 6 + play 8 — 표준 8프레임의 1.75배)을 생성·후처리했습니다. Case S **93점 / A**.

컨셉(gpt-image-2) → 스프라이트 시트(play, 8프레임):

![vocal-ex 컨셉](image/openai/2026-06-13-vocal-ex-concept.png)

![vocal-ex play 시트](design/sprite/output/vocal-ex/play.png)

> 동작 아크: 마이크 들기 → 헤드 스웨이 → **챈업 클라이맥스** → 지속음 → **양팔 거상 피날레**.
> 전 스프라이트 컬렉션(악단 + 가수 + 댄스 + vocal-ex) 통합 플레이어는 `sample15`로 배포 —
> [데모 사이트](https://psmon.github.io/pencil-creator/sample15/).

| 평가 축 | 만점 | 핵심 |
|---------|------|------|
| S1 캐릭터 충실도 | 35 | 컨셉 vs 프레임0 팔레트/정체성 일관성 |
| S2 애니메이션 품질 | 35 | 프레임 수·그리드 정렬·루프 이음매 |
| S3 공학적 활용성 | 30 | 알파·Aseprite JSON·packed master + index |

### Pipeline 보너스

| 경로 | 조건 | XP 보너스 |
|------|------|----------|
| A → B | 양쪽 60점+ | x1.2 |
| A → W | 양쪽 60점+ | x1.2 |
| B → W | 양쪽 60점+ | x1.3 |
| S → W | 양쪽 60점+ | x1.3 |
| A → B → W | 전체 60점+ | x1.5 |
| S → B → W | 전체 60점+ | x1.5 |

---

## RPG 시스템

작업 완료 시 XP를 획득하고 레벨이 올라갑니다.

```
획득XP = 기본XP(점수x10) x 등급배율(A:x5 B:x3 C:x1 D:x0.5) x 유형배율(x1.2)

등급: A(80-100) B(60-79) C(40-59) D(0-39)

현재 상태: Lv.20 "키보드 워리어" | 총 XP: 12,708
```

---

## 스킬 구성

| 스킬 | 역할 | 트리거 |
|------|------|--------|
| `harness-usage` | Case A/B/W 실행 + 평가 | "wpf-템플릿 보강해", "디자인해줘", "HTML 만들어줘" |
| `pencil-design` | Pencil MCP 다이어그램/설계도 + WPF App 마이그레이션 | "펜슬로 아키텍처 그려줘", "XAML 마이그레이션 해줘" |
| `harness-creator` | 하네스 구조 개선 | "하네스 업그레이드해줘" |

---

## 디렉토리 구조

```
pencil-creator/
├── .claude/skills/
│   ├── pencil-design/         ← Pencil MCP 디자인 스킬
│   ├── harness-usage/         ← Case A/B/W 워크플로우 + 평가
│   └── harness-creator/       ← 하네스 구조 개선
├── design/
│   ├── wpf-animation.pen      ← WPF 애니메이션 템플릿 (10 CAT, 37카드)
│   └── xaml/
│       ├── research-history.md ← WPF 조사 이력
│       ├── sample/*.xaml       ← XAML 샘플 17개
│       └── output/sample{N}/   ← HTML 산출물
├── design-wpf-app/
│   ├── design-wpf-app.slnx    ← Blend for Visual Studio에서 열기
│   ├── migrated/               ← 27개 변환된 UserControl (Blend 타임라인 편집)
│   ├── db/migration-db.json    ← 마이그레이션 현황 DB (v2 스키마)
│   └── docs/                   ← 변환 핵심 지침
├── projects/
│   ├── design/*.pen            ← 프로젝트별 디자인 (정적+애니가이드)
│   └── prompt/                 ← 프로젝트 프롬프트 기록
├── harness/
│   ├── knowledge/              ← 평가 기준 (design-craft.md)
│   ├── agents/                 ← 평가 에이전트
│   ├── engine/                 ← RPG 규칙 + 상태 모델
│   ├── logs/                   ← 작업 로그 + RPG 상태
│   └── docs/                   ← 버전 변경 이력
├── CLAUDE.md                   ← Claude Code 프로젝트 지침
└── README.md
```

---

## WPF App 마이그레이션 (Blend 편집용)

수집한 27개 XAML 애니메이션을 **Blend for Visual Studio**에서 타임라인 편집 가능한 WPF App으로 변환한 프로젝트.
다른 플랫폼(웹, 모바일)에서 애니메이션을 구현할 때, Blend 타임라인에서 키프레임/이징을 시각적으로 확인하는 용도.

### 사용법

```bash
# Blend에서 열기
design-wpf-app/design-wpf-app.slnx   # ← Blend for Visual Studio에서 이 파일 열기

# 런타임 실행 (갤러리 뷰어)
cd design-wpf-app && dotnet run

# 새 XAML 마이그레이션 요청 (Claude Code)
> "XAML을 WPF앱에 마이그레이션 해줘"
> "design/xaml/sample/28-xxx.xaml을 Blend 호환으로 변환해줘"
```

### Blend 타임라인 사용법

1. `migrated/Sample{NN}_*.xaml` 파일을 Blend에서 열기
2. **타임라인 드롭다운**에서 Storyboard 선택 (GlassHoverIn, SpinnerRotate 등)
3. **DemoSequence** 선택 시 전체 애니메이션 흐름을 한 번에 재생
4. 키프레임 클릭으로 이징/타이밍/값 수정 가능

### 프로젝트 구조

```
design-wpf-app/
├── design-wpf-app.slnx     ← Blend에서 열기
├── MainWindow.xaml          ← 좌측 네비게이션 + 우측 컨텐츠 뷰어
├── migrated/                ← 27개 변환된 UserControl
├── db/migration-db.json     ← 마이그레이션 현황 DB (v2)
└── docs/animation-migration-guide.md  ← 변환 핵심 지침
```

---

## Roadmap

이 프로젝트는 **하네스 디자인 업그레이드와 함께 지속적으로 샘플 웹을 추가**해 나갈 예정입니다.

- [ ] **Publisher App HTML 구현** (Case W) ― publisher-app.pen 디자인 + 12개 애니메이션 가이드를 실제 웹으로 구현
- [ ] **WPF 템플릿 확장** (Case A) ― CAT 10+ 추가 (Scroll-driven Animation, View Transition 등)
- [ ] **신규 프로젝트 디자인** (Case B) ― 대시보드, 이커머스, SaaS 랜딩 등 다양한 앱 레이아웃
- [ ] **하네스 v3.0** ― Case B→W 파이프라인 자동 연결, 접근성 평가 축 추가
- [ ] **디자인 시스템** ― 프로젝트 간 공유 가능한 재사용 컴포넌트 라이브러리

> 모든 샘플은 **Animation-First Design** 원칙에 따라, 룩앤필과 애니메이션 가이드를 먼저 설계한 뒤 구현합니다.

---

## 시작하기

```bash
# 1. 사전 준비
# Claude Code + Pencil 설치

# 2. 프로젝트 열기
cd pencil-creator
claude

# 3. 첫 작업 시작
> "wpf-animation 참고해서 포트폴리오 앱을 펜슬로 디자인해줘"  # Case B
> "wpf-템플릿조사 후 보강해"                                   # Case A
> "펜슬 참고해서 HTML 만들어줘"                                # Case W
> "XAML을 WPF앱에 마이그레이션 해줘"                           # Blend 편집용 변환
> "하네스가 뭐야?"                                            # 사용법 안내
```

---

## 하네스(Harness)로 직접 만들어보기

이 프로젝트의 결과물은 모두 **Pencil Design Harness (v2.6.0)** 위에서 생산됩니다.
하네스는 단순한 프롬프트 실행 도구가 아니라 **프롬프트 → 디자인 → 평가 → 레벨업** 루프를 갖춘 품질 프레임워크입니다.

- **5가지 워크플로우 케이스** — A(WPF→템플릿) · B(템플릿→프로젝트) · C(웹→JSON→컴포넌트) · D(DesignMD→펜슬) · W(펜슬→HTML)
- **3축 × 100점 자동 평가** — 결과물마다 점수/등급(A·B·C·D)이 매겨지고 `harness/logs/`에 기록됩니다
- **파이프라인 보너스** — A→B→W처럼 케이스를 이어 붙이면 최대 **1.5배 XP** 획득
- **RPG 레벨 & 업적 시스템** — 작업을 반복할수록 레벨·업적이 쌓여 품질 기준이 가시화됩니다

아래 영상은 위 하네스를 이용해 **프롬프트 한 줄에서 펜슬 디자인, HTML 구현, 자동 평가까지** 이어지는 전체 과정을 담았습니다.

<a href="https://www.youtube.com/watch?v=iFBF_CMX64g">
  <img src="https://img.youtube.com/vi/iFBF_CMX64g/hqdefault.jpg" alt="하네스 제작 과정" width="420" />
</a>

> ▶ 이미지를 클릭하면 **하네스 제작 과정 영상**이 YouTube에서 재생됩니다.

---

## 라이선스

MIT
