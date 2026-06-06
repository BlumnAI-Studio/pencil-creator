# design-journey.md — Pencil Design Journey 상태 모델

Pencil Design 작업의 전체 상태 전이 모델을 정의한다.

---

## 상태 다이어그램

```
idle
  ↓ (요청 수신)
prompted
  ↓ (유형 판별: Case A/B/C/D/S/W)
researching     ← WPF 조사 (A) / 템플릿 파악 (B) / 웹 애니메이션 분석 (C) / designmd CLI 수집 (D) / 컨셉아트 분석·팔레트 추출 (S)
  ↓
designing       ← 카드 추가 (A) / 프로젝트 디자인 (B) / JSON→펜슬 (C) / 프레임 단위 복제 (D) / Gemini edit + 후처리 + 시트 조립 (S) / HTML 생성 (W)
  ↓
design-evaluating  ← design-evaluator 3축 평가
  ↓
recording       ← 로그 작성 + RPG 처리
  ↓
idle
```

---

## 작업 유형별 경로

### Case A: WPF 조사 → 템플릿 보강
```
idle → prompted → researching(WPF) → designing(.pen 카드 추가) → design-evaluating(Case A) → recording → idle
```

### Case B: 템플릿 참고 → 프로젝트 디자인
```
idle → prompted → researching(wpf-animation.pen) → designing(정적+애니메이션 가이드) → design-evaluating(Case B) → recording → idle
```

### Case C: 웹 애니메이션 → JSON → 펜슬 컴포넌트 (Copycat)
```
idle → prompted → researching(WebFetch 분석) → designing(JSON 정의서+펜슬 컴포넌트) → design-evaluating(Case C) → recording → idle
```

### Case D: DesignMD 영입 → 펜슬 시스템 복제
```
idle → prompted → researching(designmd search/get/download, DESIGN.md 수집) → designing(design-md.pen 프레임 단위 복제 — TOKENS/COMPONENTS/TEMPLATES) → design-evaluating(Case D) → recording → idle
```

### Case S: 컨셉아트 → 스프라이트 시트
```
idle → prompted → researching(컨셉아트 비전 분석, 캐릭터 N명 슬롯 추출, 글로벌 팔레트·스타일 키워드)
  → designing(캐릭터 크롭 → Gemini edit() 다중 포즈 생성 → BiRefNet 매팅 + Unfake-Pixels 그리드 정렬 + 팔레트 양자화 → 시트 조립 + Aseprite Hash JSON → PACKED MASTER)
  → design-evaluating(Case S) → recording → idle
```

### Case W: Pencil → HTML/웹 구현
```
idle → prompted → designing(HTML, .pen/.json 참조) → design-evaluating(Case W) → recording → idle
```

### Pipeline A→B→W: WPF 완전 루프
```
idle → prompted → researching(WPF) → designing(.pen) → design-evaluating(Case A)
  → designing(프로젝트) → design-evaluating(Case B)
  → designing(HTML) → design-evaluating(Case W, 파이프라인 보너스)
  → recording → idle
```

### Pipeline C→B→W: 카피캣 완전 루프
```
idle → prompted → researching(웹 분석) → designing(JSON+펜슬) → design-evaluating(Case C)
  → designing(프로젝트) → design-evaluating(Case B)
  → designing(HTML) → design-evaluating(Case W, 파이프라인 보너스)
  → recording → idle
```

### Pipeline C→W: 카피캣 직통
```
idle → prompted → researching(웹 분석) → designing(JSON+펜슬) → design-evaluating(Case C)
  → designing(HTML) → design-evaluating(Case W, 파이프라인 보너스)
  → recording → idle
```

### Pipeline D→B→W: DesignMD 영입 → 프로젝트 → 웹 구현 완전 루프
```
idle → prompted → researching(designmd 수집) → designing(design-md.pen 복제) → design-evaluating(Case D)
  → researching(design-md.pen 참고) → designing(프로젝트 .pen) → design-evaluating(Case B, 파이프라인 보너스)
  → designing(HTML) → design-evaluating(Case W, 파이프라인 보너스)
  → recording → idle
```

### Pipeline D→W: 영입 직통
```
idle → prompted → researching(designmd 수집) → designing(design-md.pen 복제) → design-evaluating(Case D)
  → designing(HTML) → design-evaluating(Case W, 파이프라인 보너스)
  → recording → idle
```

### Pipeline S→W: 스프라이트 직통 (게임/데모)
```
idle → prompted → researching(컨셉아트 분석) → designing(시트+JSON 생성) → design-evaluating(Case S)
  → designing(HTML, _master/index.json 참조) → design-evaluating(Case W, 파이프라인 보너스)
  → recording → idle
```

### Pipeline A→S: WPF 게임 UI → 스프라이트
```
idle → prompted → researching(WPF 게임 UI 조사) → designing(.pen 카드) → design-evaluating(Case A)
  → researching(컨셉아트 분석) → designing(시트+JSON) → design-evaluating(Case S, 파이프라인 보너스)
  → recording → idle
```

### Pipeline S→B→W: 스프라이트 → 프로젝트 → 웹 완전 루프
```
idle → prompted → researching(컨셉아트) → designing(시트+JSON) → design-evaluating(Case S)
  → researching(시트 참고) → designing(프로젝트 .pen에 캐릭터 자산 통합) → design-evaluating(Case B, 파이프라인 보너스)
  → designing(HTML 게임/데모) → design-evaluating(Case W, 파이프라인 보너스)
  → recording → idle
```

---

## 상태별 담당

| 상태 | 담당 | 핵심 행동 |
|------|------|----------|
| prompted | - | Case A/B/C/D/S/W 판별, 기존 파일 상태 확인 |
| researching | pencil-design | WPF 조사 (A) / 템플릿 파악 (B) / 웹 애니메이션 분석 (C) / designmd 수집 (D) / 컨셉아트 비전 분석·팔레트 추출 (S) |
| designing | pencil-design | 카드 추가 (A) / 프로젝트 디자인 (B) / JSON→펜슬 (C) / 프레임 단위 복제 (D) / Gemini edit + 후처리 + 시트 (S) / HTML (W) |
| design-evaluating | design-evaluator | 3축 채점 + 매핑 테이블 |
| recording | design-evaluator | 로그 + XP + 업적 |
