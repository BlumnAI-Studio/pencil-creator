---
name: harness-usage
description: |
  Pencil Design Harness를 이용한 디자인 작업을 실행하는 스킬.
  Case A(WPF 조사→템플릿 보강), Case B(템플릿 참고→프로젝트 디자인), Case C(웹 애니메이션→JSON→펜슬 컴포넌트), Case D(DesignMD 영입→펜슬 복제), Case S(컨셉아트→스프라이트 시트), Case W(Pencil→HTML) 워크플로우를 실행하고 평가한다.
  다음 상황에서 반드시 이 스킬을 사용할 것:
  - "WPF 애니메이션 조사해서 펜슬에 그려줘" → Case A
  - "wpf-템플릿조사 후 템플릿보강해" → Case A
  - "애니메이션 컴포넌트 추가해줘" → Case A
  - "wpf-animation 이펙트를 참고해 OO 디자인해줘" → Case B
  - "펜슬을 이용해 OO 디자인" + wpf-animation 참고 언급 → Case B
  - "OO사이트 애니메이션 조사해서 템플릿 강화" → Case C
  - "URL 분석해서 애니메이션 JSON 정리해줘" → Case C
  - "웹 애니메이션 카피캣" → Case C
  - "designmd에서 OO 디자인 영입해줘" → Case D
  - "디자인엠디 디자인 시스템 복제" → Case D
  - "DESIGN.md 펜슬에 프레임 단위로 복제" → Case D
  - "악단컨셉 스프라이트 만들어줘" → Case S
  - "캐릭터별 스프라이트 시트 생성" → Case S
  - "컨셉아트에서 캐릭터 분리해줘" → Case S
  - "배경 투명 스프라이트 추출" → Case S
  - "펜슬 참고해서 HTML 페이지 만들어줘" → Case W
  - "디자인을 웹으로 구현해줘" → Case W
  - "디자인 평가해줘", "점수 매겨줘" → 평가 실행
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent, WebSearch, WebFetch, mcp__pencil__get_guidelines, mcp__pencil__open_document, mcp__pencil__get_editor_state, mcp__pencil__batch_design, mcp__pencil__get_screenshot, mcp__pencil__find_empty_space_on_canvas, mcp__pencil__snapshot_layout, mcp__pencil__batch_get, mcp__pencil__get_style_guide_tags, mcp__pencil__get_style_guide, mcp__pencil__get_variables
---

# Harness Usage — Pencil Design 작업 실행

`harness/` 3계층 구조를 기반으로 **Case A(WPF→템플릿), Case B(템플릿참고→프로젝트 디자인), Case C(웹 애니메이션→JSON→펜슬 컴포넌트), Case D(DesignMD 영입→펜슬 복제), Case S(컨셉아트→스프라이트 시트), Case W(Pencil→HTML) 워크플로우**를 실행한다.

---

## 1. Design Journey 상태 모델

```
idle → prompted → researching → designing → design-evaluating → recording → idle
```

| 상태 | 핵심 행동 |
|------|----------|
| prompted | Case A/B/C/D/S/W 판별, 기존 파일 상태 확인 |
| researching | WPF 조사 (A) / wpf-animation.pen 파악 (B) / 웹 애니메이션 분석 (C) / designmd CLI 수집 (D) / 컨셉아트 비전 분석·팔레트 추출 (S) |
| designing | 카드 추가 (A) / 프로젝트 디자인 (B) / JSON→펜슬 컴포넌트 (C) / design-md.pen 프레임 복제 (D) / Gemini edit + 후처리 + 시트 (S) / HTML 구현 (W) |
| design-evaluating | 3축 채점 (harness/knowledge/design-craft.md 참조) |
| recording | 로그 작성 + RPG(XP/레벨/업적) 처리 |

---

## 2. Case A: WPF 조사 → 템플릿 보강

wpf-animation.pen에 **새로운 WPF 애니메이션 기법 카드를 직접 추가**하는 워크플로우.

```
Phase 1 — Gather (researching):
  → WebSearch로 WPF Storyboard 애니메이션 예제 조사
  → 기존 wpf-animation.pen 카테고리/카드 목록 확인 (중복 제외)
  → 핵심 기술 수집: EventTrigger, DoubleAnimation, Transform, Easing
  → design/xaml/sample/*.xaml 기존 파일 확인

Phase 2a — Action: 개별 카드 (designing):
  → wpf-animation.pen에 신규 카드 생성
  → 각 카드 구조: 번호+제목 + WPF 속성 설명 + Before→After 시각 미리보기 + XAML 코드 스니펫
  → 다크 테마 (#0A0F1C 배경, #22D3EE cyan 악센트, JetBrains Mono)
  → design/xaml/sample/ 에 .xaml 샘플 파일 저장
  → design/xaml/research-history.md 갱신

Phase 2b — Action: COMBINED SAMPLE (designing):
  ⚠️ 조사 출처에서 2개+ 기법이 조합된 실제 사용 사례가 파악된 경우 반드시 생성
  → wpf-animation.pen 하단에 "SAMPLE — {이름} (통합 컴포넌트)" 프레임 생성
  → 구성 요소:
    - COMBINED SAMPLE 배지 + Source URL
    - 타이틀 + 기법 조합 요약 설명
    - 좌측: 시각 프리뷰 (실제 동작 모습의 정적 표현 + 범례)
    - 우측: 스펙 그리드 (Canvas/Lines/Trim/Color/Stagger/Easing 등 핵심 수치)
    - 우측 하단: JSON/XAML REFERENCES (관련 파일 경로 매핑)
    - 하단: WPF IMPLEMENTATION + CSS/SVG IMPLEMENTATION 코드 블록 나란히
  → 가치: 이 프레임 하나만 참조하면 개별 카드를 조합할 필요 없이 즉시 구현 가능
  → Case W에서 이 SAMPLE 프레임을 직접 참조하여 HTML 생성 가능

Phase 3 — Verify (design-evaluating):
  → design-craft.md Case A 3축 평가
    A1: 리서치 신규성 (35점)
    A2: 시각화 표현력 (35점)
    A3: 메타 완결성 (30점)
  → recording: 로그 + RPG
```

---

## 3. Case B: 템플릿 참고 → 프로젝트 디자인

wpf-animation.pen을 **참고 라이브러리**로 활용하여 프로젝트 요구사항에 맞는 새 .pen 디자인을 생성하는 워크플로우.
**핵심 원칙: 정적 디자인(룩앤필)과 동적 정의(애니메이션 가이드)를 분리한다.**

```
Phase 1 — Gather (researching):
  → 사용자 요구사항 파악 (페이지 구성, 기능, 유효검사, 룩앤필)
  → wpf-animation.pen 카테고리/카드 전체 파악 (어떤 기법을 적용할지 계획)
  → design/xaml/sample/*.xaml 에서 적용할 기법의 정밀 파라미터 확인
    ⚠️ .pen만 읽으면 "대략적 파악", .xaml까지 읽어야 "정확한 Duration/Easing/값" 확보
  → Pencil get_guidelines로 스타일/가이드 로딩 (룩앤필 방향 결정)
  → 프로젝트 .pen 파일 상태 확인

Phase 2a — Action: 정적 디자인 (designing):
  → 프로젝트 .pen 파일에 정적 화면 생성
  → 재사용 컴포넌트 먼저 정의 (사이드바, 버튼 등)
  → 각 화면: 사이드바 인스턴스 + 메인 콘텐츠
  → 스타일 가이드 색상/폰트/라운드니스 일관 적용
  → 화면별 스크린샷 검증

Phase 2b — Action: 애니메이션 가이드 (designing):
  → 동일 .pen 파일 내 별도 섹션으로 생성 (정적 화면 아래)
  → 히어로 프레임: "ANIMATION GUIDE" 타이틀
  → 화면별 카테고리 분리 (CAT-A: Dashboard, CAT-B: Upload 등)
  → 각 카드 구조:
    - 번호 + 제목 (악센트 컬러, Inter, uppercase)
    - Target: {Screen}/{Frame} 적용 위치 명시
    - WPF 동작 설명 (속성, 이징, 듀레이션)
    - Before → After 시각 미리보기 (absolute 배치)
    - XAML 코드 스니펫 (Geist Mono)
  → ⚠️ 룩앤필 매칭 필수: 정적 디자인이 밝은 테마 → 애니메이션 가이드도 밝은 테마
  → wpf-animation.pen의 다양한 카테고리에서 기법 참고 (최소 4개 CAT 이상)

Phase 3 — Verify (design-evaluating):
  → design-craft.md Case B 3축 평가
    B1: 요구사항 충실도 (35점)
    B2: 애니메이션 가이드 풍부성 (35점)
    B3: 디자인 품질 & 분리 기법 (30점)
  → recording: 로그 + RPG
```

### Case B 체크리스트

정적 디자인과 애니메이션 가이드의 **분리 품질**을 보장하기 위한 체크리스트:

```
□ 정적 화면과 애니메이션 가이드가 물리적으로 분리된 프레임인가?
□ 애니메이션 가이드의 각 카드에 Target 프레임이 명시되어 있는가?
□ 룩앤필이 일관되는가? (밝은↔밝은, 어두운↔어두운)
□ wpf-animation.pen에서 4개+ 카테고리의 기법을 참고했는가?
□ 각 카드가 Before→After 시각 미리보기를 포함하는가?
□ XAML 코드 스니펫이 WPF 문법에 맞는가?
□ 재사용 컴포넌트(sidebar 등)가 ref로 활용되는가?
```

---

## 4. Case C: 웹 애니메이션 조사 → JSON → 펜슬 컴포넌트 (Copycat)

특정 웹사이트의 실제 애니메이션을 분석하여 **JSON 기법 정의서**를 생성하고, 이를 기반으로 **재사용 가능한 펜슬 컴포넌트**를 구축하는 워크플로우.
**핵심 원칙: 실제 웹 애니메이션을 분석 → JSON 구조로 정의 → 펜슬 컴포넌트 라이브러리로 축적하여 재활용.**

```
Phase 1 — Gather (researching):
  → 대상 URL 접속 및 특정 요소/섹션 식별
  → WebFetch로 HTML/CSS/JS 구조 분석 (라이브러리, @keyframes, transition 등)
  → (선택 — 사용자 요청 시) Playwright로 해당 섹션 스크린샷 캡처 / browser_evaluate로 computed animation 추출
  → Lottie 파일 발견 시: 다운로드 → ZIP 해제 → JSON 레이어/키프레임 분석
  → 애니메이션 기법 분류 (기법별 독립 분석)

Phase 2a — Action: JSON 기법 정의서 생성 (designing):
  → design/json/sample/ 하위에 넘버링 파일 생성
  → 파일명: {NN}-{기법이름}.json (예: 01-방사형-음성파동.json)
  → 각 JSON 필수 구조:
    {
      "technique": "영문 기법명",
      "name_ko": "한글 기법명",
      "source": "출처 URL + 섹션 설명",
      "description": "기법 요약 설명",
      "rendering": "구현 방식 (Lottie/CSS/JS/SVG/Canvas)",
      "structure": { 레이어/요소 구조 },
      "animationDetails": { 키프레임/타이밍/이징/색상 상세 },
      "cssImplementation": { CSS/JS 재현 참고 코드 }
    }
  → 기법별 독립 JSON: 하나의 애니메이션이라도 구성 요소별로 분리
    (예: 음성파동 → 01-방사형배치, 02-트림패스, 03-색상전환 각각 분리)

Phase 2b — Action: 펜슬 컴포넌트 업데이트 (designing):
  → JSON 기법 정의서를 기반으로 wpf-animation.pen 또는 전용 .pen 파일에 컴포넌트 카드 추가
  → 각 카드 구조:
    - 번호 + 기법명 (JSON의 technique/name_ko 매핑)
    - Source: 원본 웹사이트 URL
    - 렌더링 방식 표시 (Lottie/CSS/SVG 등)
    - Before → After 시각 미리보기
    - 핵심 파라미터 요약 (JSON에서 추출)
  → JSON과 펜슬 카드 간 1:N 또는 N:1 매핑 가능
  → 향후 Case W에서 HTML 구현 시 재활용 목적

Phase 2c — Action: COMBINED SAMPLE (designing):
  ⚠️ 분석 대상 웹사이트에서 2개+ 기법이 조합된 실제 사용 사례가 파악된 경우 반드시 생성
  → wpf-animation.pen 하단에 "SAMPLE — {이름} (통합 컴포넌트)" 프레임 생성
  → 프레임 구성:
    - COMBINED SAMPLE 배지 (빨강 #E4324F) + Source URL
    - 타이틀 (한영 병기) + 기법 파이프라인 요약 (분석→분리→매핑)
    - 좌측 VISUAL STRUCTURE: 실제 동작의 정적 표현 + 범례 (Active/Inactive/Transition)
    - 우측 ANIMATION SPEC: 핵심 수치 그리드 (Canvas, Lines, Trim, Color, Stagger, Easing)
    - 우측 JSON REFERENCES: 관련 JSON 파일 경로 ← 기법명 매핑
    - 하단 코드 블록: WPF IMPLEMENTATION + CSS/SVG IMPLEMENTATION 나란히
  → 가치:
    - 개별 카드 = 기법별 학습/재조합용 (사용자가 원하는 조합 가능)
    - COMBINED SAMPLE = 실제 사례 그대로 즉시 구현용 (조합 고민 불필요)
    - Case W에서 이 SAMPLE 프레임 하나만 참조하면 전체 애니메이션 구현 가능

Phase 3 — Verify (design-evaluating):
  → design-craft.md Case C 3축 평가
    C1: 조사 깊이 & 정확성 (35점)
    C2: JSON 구조 완결성 (35점)
    C3: 펜슬 컴포넌트 품질 (30점)
  → recording: 로그 + RPG
```

### Case C 체크리스트

```
□ WebFetch로 HTML/CSS/JS 구조를 분석했는가? (Playwright는 사용자 요청 시에만)
□ Lottie/JS/CSS 등 실제 구현 기술을 정확히 식별했는가?
□ 각 기법별 독립 JSON 파일이 design/json/sample/에 넘버링 생성되었는가?
□ JSON에 technique, source, structure, animationDetails, cssImplementation이 포함되었는가?
□ 펜슬 컴포넌트 카드가 JSON과 매핑되어 생성되었는가?
□ Before→After 시각 미리보기가 포함되었는가?
□ 재활용 가능한 형태로 구조화되었는가? (다음 세션에서 참조 가능)
□ 2개+ 기법이 조합된 경우, COMBINED SAMPLE 프레임이 생성되었는가?
□ COMBINED SAMPLE에 시각 프리뷰 + 스펙 + JSON 참조 + WPF/CSS 코드가 통합되었는가?
```

---

## 4-2. Case D: DesignMD → 펜슬 디자인 시스템 복제

designmd CLI로 외부 디자인 시스템(`DESIGN.md`)을 영입하여 **`design/design-md.pen` 파일에 프레임 단위로 복제**하는 워크플로우.
**핵심 원칙: DESIGN.md 스펙을 TOKENS → COMPONENTS → TEMPLATES의 3계층 프레임으로 분해 재구성하여 펜슬 디자인 시스템 라이브러리로 축적한다.**

```
Phase 1 — Gather (researching):
  → designmd CLI 활용 (Bash 실행):
    - `designmd search "<키워드>" --limit 5` 또는 `--tag <tag>` 로 후보 탐색
    - `designmd get <user/slug>` 로 상세 파악 (사용자 승인 후 선정)
    - `designmd download <user/slug> -o design/design-md/<slug>/DESIGN.md`
    - (필요 시) `designmd tags` 로 태그 생태계 확인
  → 다운로드된 DESIGN.md를 Read 도구로 전체 파싱
  → 섹션 인덱스 생성: Brand, Tokens(Color/Typography/Spacing/Radius/Shadow), Components, Templates
  → 메타 기록: name, slug, tags, license, source URL
  → 유사 레퍼런스 2개+ 비교 조사 (선택 — 최상위 점수 목표 시)

Phase 2a — Action: 디자인 시스템 복제 (designing):
  ⚠️ 대상 파일: design/design-md.pen (없으면 open_document('new')로 생성)
  → 파일 루트에 인덱스 프레임: {시스템명}·메타·원본 링크·라이선스
  → TOKENS 섹션 (별도 프레임 그룹):
    - Color Tokens 프레임: primary/secondary/neutral/success/warning/danger 팔레트 (hex 값 복제)
    - Typography 프레임: 폰트 패밀리/사이즈 스케일/웨이트
    - Spacing 프레임: 4/8/12/16/24/... 스케일
    - Radius 프레임, Shadow 프레임 (원본에 있는 경우)
  → COMPONENTS 섹션 (컴포넌트별 독립 프레임):
    - 각 프레임: 원본 이름 + Variants + 상태별 변형 (default/hover/active/disabled)
    - reusable 컴포넌트로 정의 (템플릿에서 ref로 참조할 수 있게)
  → TEMPLATES 섹션 (페이지 템플릿 프레임):
    - 원본 DESIGN.md에 명시된 페이지/화면을 프레임으로 재구성
    - 이미 만든 컴포넌트를 ref로 조립 (중복 그리기 금지)
  → 각 프레임 헤더에 "Source: DESIGN.md § {섹션명}" 참조 표기

Phase 2b — Action: README 프레임 (designing):
  → design-md.pen 최상단 또는 최하단에 "README" 프레임
  → 내용:
    - 시스템 소개 (1-2줄)
    - 원본 출처 URL + 라이선스 고지
    - 토큰 → 컴포넌트 → 템플릿 계층 설명
    - Case B 연결: "이 시스템을 참고하여 프로젝트 .pen 디자인 시 적용 방법"
    - Case W 연결: "이 .pen을 참고하여 HTML 구현 시 매핑 가이드"
  → 다크/라이트 변형 지원 여부 명시

Phase 3 — Verify (design-evaluating):
  → design-craft.md Case D 3축 평가
    D1: 수집 충실도 (35점)
    D2: 프레임 단위 복제 정확도 (35점)
    D3: 토큰 & 템플릿 재사용성 (30점)
  → recording: 로그 + RPG
```

### designmd CLI 인증 체크

```
□ `designmd --version`이 동작하는가? (미설치 시 사용자에게 안내)
□ DESIGNMD_API_KEY가 환경에 설정되어 있는가? (download/get/upload 시 필요)
□ 라이선스가 mit/cc0/cc-by/cc-by-sa 중 하나인지 확인 후 출처 고지 규칙 준수
```

### Case D 체크리스트

```
□ designmd search/get/download CLI를 실제로 호출했는가?
□ DESIGN.md 원본이 design/design-md/{slug}/ 에 보존되었는가?
□ design/design-md.pen 루트에 인덱스 프레임이 있는가?
□ TOKENS 3계층(Color/Typography/Spacing 최소) 프레임이 분리되었는가?
□ COMPONENTS 각각이 독립 프레임으로 존재하는가?
□ TEMPLATES 프레임이 기존 컴포넌트를 ref로 조립하는가?
□ 각 프레임에 "Source: DESIGN.md § {섹션명}" 참조가 있는가?
□ README 프레임에 라이선스·원본 URL·Case B/W 연결 가이드가 있는가?
□ get_screenshot()으로 시각 검증했는가?
```

---

## 4-3. Case S: Concept Art → Sprite Sheet

컨셉아트(예: `image/sprite/악단컨셉.png`)에서 **캐릭터별 배경 투명 스프라이트 시트**(Aseprite Hash JSON 호환)와 멀티프레임 액션(idle/play 등)을 생성하는 워크플로우.
**핵심 원칙: Gemini `edit()` 모드로 원본 캐릭터 크롭을 참조하여 일관성을 유지하고, BiRefNet 매팅 + 픽셀 그리드 양자화 + 원본 팔레트 스냅 후처리로 게임/웹 즉시 활용 가능한 자산을 만든다.**

```
Phase 1 — Gather (researching):
  → 컨셉아트 비전 분석 (캐릭터 N명 슬롯 추출: 이름·악기·도미넌트색·실루엣 박스)
  → ColorThief로 글로벌 팔레트 추출 → image/sprite/palette.json
  → 스타일 키워드 추출 ("chibi pixel art, 24x32, dark fantasy fairy tale, muted earth tones")
  → 캐릭터별 크롭 저장 (image/sprite/crops/{slug}.png)
  → slug 규칙: vocal-{1..4} / piano, violin, viola, cello, contrabass, flute, clarinet, oboe,
                trumpet, trombone, horn, tuba, drum, guitar, harp

Phase 2a — Action: Gemini edit() 다중 포즈 생성 (designing):
  → 프롬프트 템플릿:
    base = "{style_kw}, single character isolated on pure #00FF00 chroma green,
            {character_desc}, {pose: idle|play|walk|cheer} frame {N}, no shadow"
  → 호출: image-gen.py edit --prompt ... --input-image image/sprite/crops/{slug}.png
  → 시드 고정: hash(slug) % 2^32 (캐릭터 일관성 핵심)
  → 출력 256×256 (8배 업스케일 캔버스 — 후처리에서 24×32로 다운)
  → Batch 모드 권장 (50% 비용 절감)
  → 원본 보존: image/sprite/raw/{date}-{slug}-{pose}-f{N}.png

Phase 2b — Action: 후처리 파이프라인 (designing):
  1) BiRefNet 매팅 → 알파 클린업 (또는 폴백 HSV 그린키 제거)
  2) Unfake-Pixels → 24×32 그리드 검출 + 양자화
  3) PIL.Image.quantize(palette=원본 13색) 강제 스냅 (ΔE>15 픽셀 → 최근 팔레트 색)
  4) 알파 이진화 (테두리 ≤ 1px)

Phase 2c — Action: 시트 조립 + Aseprite Hash JSON (designing):
  → 캐릭터·액션별 시트: design/sprite/output/{slug}/{action}.png
  → 통합 메타: design/sprite/output/{slug}/sheet.json
  → 필수 필드: meta.app, meta.image, frames {key: {frame, sourceSize, duration}}, frameTags[]
  → 균일 패딩 2px

Phase 2d — Action: PACKED MASTER 시트 (designing):
  → design/sprite/output/_master/orchestra-master.png (19행 × 액션×프레임)
  → design/sprite/output/_master/index.json: slug → 시트/JSON 경로 매핑
  → Case W에서 단일 진입점으로 로드 가능

Phase 3 — Verify (design-evaluating):
  → design-craft.md Case S 3축 평가
    S1: 캐릭터 충실도 (35점) — 원본 크롭 vs idle frame 0 SSIM/ΔE2000
    S2: 애니메이션 품질 (35점) — 프레임 수, 그리드 정렬, 루프 이음매
    S3: 공학적 활용성 (30점) — 알파, Aseprite JSON, PACKED MASTER, index.json
  → recording: 로그 + RPG
```

### Case S 체크리스트

```
□ 컨셉아트에서 캐릭터 N명을 모두 슬롯으로 추출했는가? (slug + 도미넌트색 + 박스)
□ image/sprite/palette.json (글로벌 팔레트)이 생성되었는가?
□ image/sprite/crops/{slug}.png (캐릭터 크롭)이 모든 캐릭터에 대해 존재하는가?
□ Gemini edit() 모드(input_image 참조)를 사용했는가? (generate-only는 자동 -10)
□ 시드를 고정했는가? (캐릭터별 hash(slug) % 2^32)
□ 후처리 4단계(BiRefNet → Unfake-Pixels → 팔레트 양자화 → 알파 이진화)를 모두 수행했는가?
□ 캐릭터별 sheet.json이 Aseprite Hash 포맷(frames/meta/frameTags)인가?
□ _master/orchestra-master.png + index.json이 생성되었는가?
□ 표준 스코프(idle 4f + play 4f) 또는 풀 스코프(4액션×6프레임)를 명시했는가?
□ 파일럿 1명(피아노)부터 시작 → 점수 ≥70 확인 후 N명 배치했는가?
```

### 파일럿 게이트

19명 전체 배치 전에 **피아노 1명**으로 파일럿 평가 수행:
- 점수 < 70 → 19명 배치 중단 → 프롬프트/후처리 튜닝 → 재파일럿
- 점수 ≥ 70 → Gemini Batch로 전체 진행 (비용 폭증 방지)

### 핵심 CLI

```bash
# 컨셉아트 분석
python .claude/skills/pencil-design/scripts/sprite-analyze.py \
  --input image/sprite/악단컨셉.png \
  --output-dir image/sprite/

# 캐릭터 프레임 생성 (Gemini edit)
python .claude/skills/pencil-design/scripts/image-gen.py edit \
  --prompt "..." --input-image image/sprite/crops/piano.png \
  --topic "piano-idle-f0" --provider gemini

# 후처리 + 시트 조립
python .claude/skills/pencil-design/scripts/sprite-postprocess.py \
  --character piano --pose idle --raw-dir image/sprite/raw/ \
  --palette image/sprite/palette.json \
  --output design/sprite/output/piano/idle.png
```

---

## 5. Case W: Pencil → HTML 구현

⚠️ Case C의 JSON 기법 정의서가 존재하면 `.pen` + `.json` 이중 참조로 더 정밀한 구현 가능.

```
Phase 1 — Gather:
  → .pen 파일의 카테고리/컴포넌트 파악 (batch_get으로 카드 구조/색상/레이아웃)
  → design/xaml/sample/*.xaml 에서 해당 기법의 정밀 애니메이션 파라미터 읽기
    ⚠️ 이중 참조 필수:
      .pen → 어떤 기법인지, 시각 구조, 색상 체계 파악
      .xaml → Duration, EasingFunction, From/To, BeginTime 등 정밀 수치 확보
      .pen만 읽으면 퀄리티가 떨어진다! 반드시 .xaml까지 읽어야 정확한 WPF→Web 매핑 가능
  → 애니메이션 가이드 카드 확인 (Case B 산출물이 있으면 참조)
  → get_screenshot()으로 시각 요소 확인

Phase 2 — Action (designing):
  → .pen 정적 디자인을 HTML/CSS/JS로 변환 (JS/CSS 분리 구현)
  → XAML → Web 매핑 (확장 테이블):
    WPF DoubleAnimation → CSS transition 또는 WAAPI
    QuadraticEase EaseIn → JS quadratic easing (t*t)
    SineEase EaseInOut → CSS ease-in-out 또는 cubic-bezier(0.445,0.05,0.55,0.95)
    ScaleTransform → transform: scale()
    ColorAnimation → CSS color transition
    OpacityAnimation → opacity transition 또는 JS globalAlpha
    TranslateTransform → transform: translateX/Y() 또는 JS rAF
    RotateTransform → transform: rotate() + @keyframes
    ElasticEase → cubic-bezier(0.175, 0.885, 0.32, 1.275)
    Stagger BeginTime → animation-delay 증분 또는 WAAPI Promise chain
    AutoReverse + Forever → CSS alternate infinite
    RepeatBehavior="Forever" → animation: infinite 또는 rAF loop
    Path stroke animation → SVG stroke-dasharray/dashoffset
    DropShadowEffect Glow → filter: drop-shadow() animation
    Confetti Burst → WAAPI particle system
  → SVG 리얼리티 필수 규칙:
    ⚠️ 자연물(꽃잎, 잎 등)은 radialGradient 적용 (flat fill 금지 = 종이조가리)
    ⚠️ 복합 요소(꽃+줄기+잎)는 통합 SVG 1개로 구성 (분리하면 따로 놈)
    ⚠️ Canvas 파티클 초기 등장 시 fade-in 지연 적용 (떨림 방지)
    ⚠️ 외부 이미지(PNG) 대신 SVG Blob URL, Base64, CSS로 자체 생성
  → 순차 시퀀스 애니메이션 (WAAPI 권장):
    Web Animations API의 .animate().finished로 Promise chain 구성
    스테이지별 진행 표시기 UI 제공 (Seed→Grow→Bloom 등)
  → 파라미터 제어 UI: 슬라이더로 speed/count/force 실시간 조절
  → 다중 CAT 활용: wpf-animation.pen의 4개+ 카테고리 기법 통합
  → 저장: design/xaml/output/sample{N}/index.html
  → 최대한 많은 애니메이션 가이드 카드를 실제 구현

Phase 3 — Verify (design-evaluating):
  → design-craft.md Case W 3축 평가
    W1: 디자인 커버리지 (35점)
    W2: 애니메이션 충실도 (35점)
    W3: 독창적 확장 (30점)
  → Playwright 섹션별 캡처 (선택)
  → recording: 로그 + RPG
```

---

## 6. Playwright 섹션별 캡처 (선택 — 사용자 요청 시에만)

⚠️ **이 단계는 자동 실행하지 않는다.** 사용자가 "스크린샷 캡처해줘", "Playwright로 검수해줘" 등 명시적으로 요청한 경우에만 수행한다.

HTML 데모의 각 섹션을 스크린샷으로 캡처하는 워크플로우.

```
1. python -m http.server 8765 (HTML 디렉토리에서)
2. browser_resize(1400, 900)
3. browser_navigate("http://localhost:8765/")
4. 각 섹션별:
   browser_evaluate(() => document.getElementById('{id}').scrollIntoView())
   waitForTimeout(1500)
   browser_take_screenshot(filename: "tmp/playwright/sample{N}/{순번}-{섹션}.png")
⚠️ 스크린샷은 tmp/playwright/ 이하에 저장 (git 커밋 대상 아님, 파일 크기 이슈)
```

---

## 7. 로그 & RPG

모든 작업 완료 후 recording 단계에서 실행한다.

```
1. 로그: harness/logs/yyyy-mm-dd-{키워드}-case{A|B|C|D|S|W}.md
2. 인덱스: harness/logs/harness-usage.md에 1줄 추가
3. XP 계산: 기본XP(점수×10) × 등급배율(A:5/B:3/C:1/D:0.5) × 유형배율(A:1.2/B:1.2/C:1.2/D:1.2/S:1.2/W:1.2)
4. 레벨업 판정 + 업적 갱신 (harness/engine/level-achievement-system.md 참조)
```

---

## 8. Pipeline 보너스

| 파이프라인 | 조건 | 보너스 |
|-----------|------|--------|
| A → B | 양쪽 60점+ | 각 XP × 1.2 |
| A → W | 양쪽 60점+ | 각 XP × 1.2 |
| B → W | 양쪽 60점+ | 각 XP × 1.3 |
| C → W | 양쪽 60점+ | 각 XP × 1.3 |
| C → B | 양쪽 60점+ | 각 XP × 1.2 |
| D → B | 양쪽 60점+ | 각 XP × 1.3 |
| D → W | 양쪽 60점+ | 각 XP × 1.3 |
| S → W | 양쪽 60점+ | 각 XP × 1.3 |
| S → B | 양쪽 60점+ | 각 XP × 1.2 |
| A → S | 양쪽 60점+ | 각 XP × 1.2 |
| A → B → W | 전체 60점+ | 각 XP × 1.5 |
| C → B → W | 전체 60점+ | 각 XP × 1.5 |
| D → B → W | 전체 60점+ | 각 XP × 1.5 |
| S → B → W | 전체 60점+ | 각 XP × 1.5 |