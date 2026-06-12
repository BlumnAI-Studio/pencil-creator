---
name: sprite-animation-flow
type: engine
case: S
version: 1.0.0
since: harness v2.8.0
participating_agents:
  - sprite-animator
  - design-evaluator    # 마지막 공식 채점 + RPG XP
references:
  knowledge: harness/knowledge/sprite-animation-craft.md
  agent: harness/agents/sprite-animator.md
  case_rules: harness/knowledge/design-craft.md#4-3
---

# sprite-animation-flow — 5 Phase 스프라이트 애니메이션 워크플로우

`sprite-animator` 전문가가 수행하는 표준 5 Phase. 각 Phase는 결정점(✋)에서 사용자 확인을 받는다.

```
idle
  ↓ (트리거: "스프라이트 애니메이션 만들어", "캐릭터 시퀀스 생성" 등)
prompted (sprite-animator 매칭 확인)
  ↓
─────────────────────────────────────────────────────────
Phase 1 — analyze (researching)
─────────────────────────────────────────────────────────
  1-1. 컨셉아트 비전 분석 → 캐릭터 슬롯 N명
  1-2. std 기반 행/열 검출 → 박스 좌표 후보 산출
  1-3. 캐릭터별 desc 작성 (머리색·의상·소품)
  1-4. character-boxes{*}.json 저장
  1-5. sprite-analyze 스크립트 실행 → crops + preview-grid
  ✋ 박스 좌표 시각 검증 → 사용자 OK?
─────────────────────────────────────────────────────────
Phase 2 — pilot (designing 1차)
─────────────────────────────────────────────────────────
  2-1. 대표 캐릭터 1명 선정 (악단: piano, 댄스단: cheer-1 같이 의상이 뚜렷한 것)
  2-2. Gemini edit() 호출 — chroma green + desc + 강조 프롬프트
  2-3. 시각 검증: 의상/머리/포즈 일관성
  ✋ 점수 ≥70 또는 시각적으로 OK → 사용자 진행 OK?
       NO → Phase 1로 회귀 (박스/desc 조정)
─────────────────────────────────────────────────────────
Phase 3 — batch (designing 2차, 백그라운드)
─────────────────────────────────────────────────────────
  3-1. 호출 계획: N캐릭터 × M액션 × K프레임
       단일 포즈 모드(간소): N × 1 frame
       풀 사이클 모드: N × actions × 4 frame
  3-2. tmp-batch 스크립트 작성 (skip-exists 로직)
  3-3. 백그라운드 실행 (run_in_background=true)
  3-4. 완료 알림 수신 → 실패 frame 자동 재호출
─────────────────────────────────────────────────────────
Phase 4 — fix-pass (designing 3차, 아티팩트 교정)
─────────────────────────────────────────────────────────
  4-1. 자체 진단:
        - 머리/캐릭터 중복 (시각)
        - chroma green 잔여 (HSV 픽셀 카운트)
        - 인접 캐릭터 침범 (bbox 가로폭 anomaly)
  4-2. 사용자에게 의심 frame 목록 보고
  ✋ 사용자가 추가 의심 frame 알려줌 (예: "clarinet f3도 둘", "viola f2 이상")
  4-3. 교정 라운드 1: 강조 프롬프트 + 동일 reference
  4-4. 잔여 frame: 교정 라운드 2 — 동일 캐릭터의 검증된 clean frame을 reference로 재호출
  ✋ 모든 frame 단일 캐릭터 확인 → 사용자 OK?
─────────────────────────────────────────────────────────
Phase 5 — integrate (시트 + master + 미러)
─────────────────────────────────────────────────────────
  5-1. sprite-postprocess.py process --target-size 192x192
        HSV 매팅 → bbox 크롭 → nearest 다운스케일 → 양자화 → 알파 이진화
  5-2. sprite-postprocess.py assemble --target-size 192x192
        master.png + index.json (frame_size 192×192, padding 8)
  5-3. sample{N}/sprites|dance 미러
  5-4. design-evaluator Case S 공식 채점 → RPG XP 적용
─────────────────────────────────────────────────────────
  ↓
design-evaluating (design-evaluator가 Case S 3축 채점)
  ↓
recording (로그 + RPG)
  ↓
idle
```

---

## 결정점 (✋) 처리 규칙

| 결정점 | 자동 진행 조건 | 사용자 명시 필요 조건 |
|--------|----------------|---------------------|
| Phase 1 박스 검증 | preview-grid에서 박스 무겹침 + 캐릭터 포함률 100% | 박스 침범 의심 또는 N개 이상 |
| Phase 2 시범 결과 | 시각적으로 의상/머리 일관, chroma 깔끔 | 의상 표류, 머리 둘, 정체성 변형 |
| Phase 4 의심 frame | 자체 진단 0건 | 1건 이상 또는 사용자 추가 지적 |

---

## Pipeline 보너스

기존 Case S 파이프라인 보너스(`design-craft.md` §7)를 그대로 적용:

| 조합 | 배수 | 조건 |
|------|------|------|
| S → W | ×1.3 | both ≥60 |
| S → B | ×1.2 | both ≥60 |
| A → S | ×1.2 | both ≥60 |
| S → B → W | ×1.5 | all ≥60 |

sprite-animator가 수행하는 Case S 결과가 sample{N}에 통합되면 자동으로 S→W 파이프라인 보너스 후보가 된다.

---

## 트리거 매칭표

| 사용자 발화 | 매칭 | 진입 Phase |
|------------|------|-----------|
| "스프라이트 애니메이션 만들어" | sprite-animator | Phase 1 |
| "캐릭터 스프라이트 시퀀스 생성" | sprite-animator | Phase 1 |
| "악단/댄스단 스프라이트 만들어" | sprite-animator | Phase 1 (컨셉아트 이미 있으면 Phase 2) |
| "스프라이트 일관성 검수" | sprite-animator | Phase 4 |
| "캐릭터 두 명 그려진 거 찾아" | sprite-animator | Phase 4 (진단만) |
| "Case S 평가해줘" | design-evaluator | (대상 = sprite-animator 산출물) |
