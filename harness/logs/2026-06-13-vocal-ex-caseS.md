# 2026-06-13 — vocal-ex 보컬 확장 스프라이트 (Case S)

**Case S (Concept Art → Sprite Sheet)** · 실제 영상 동작 분석 기반 첫 확장판 · gpt-image-2 컨셉 파이프라인 첫 적용

---

## 1. 작업 개요

| 항목 | 내용 |
|------|------|
| 트리거 | `"최근 분석한 가수의 노래동작을 gpt2 이미지로 캐릭터애니 컨셉 먼저잡고, 그 컨셉으로 스프라이트 셋트 생성 — vocal ex 확장버전"` |
| 소스 | YouTube FIFA 월드컵 'DNA' 무대 가수 동작 분석 (`image/video-analysis/6_uZAPTa9O0/`) — video-motion-analysis 스킬 산출 |
| 캐릭터 | vocal-ex (긴 흑갈색 웨이브 머리, 청록 스테이지 가운+금장식, 마이크) |
| 컨셉 생성 | **gpt-image-2 (openai provider)** — `image/openai/2026-06-13-vocal-ex-concept.png` (캐릭터 디자인 시트) |
| 프레임 생성 | gpt-image-2 `edit()` × 14 (컨셉을 reference로 일관성 유지, #00FF00 그린 배경) |
| 액션 / 프레임 | **idle 6f + play(sing) 8f = 14 프레임** (기존 vocal 8f → **1.75배 확장**) |
| 픽셀 사이즈 | 192×192 (기존 세트 규격 일치) |
| 매팅 | HSV 그린키 (그린 잔여 0px) |
| 산출 시트 | `design/sprite/output/vocal-ex/{idle\|play}.png` + `.json` (Aseprite Hash) |
| 프리뷰 | `design/sprite/output/vocal-ex/preview.html` (idle/play 루프 애니메이션) |
| 원본 보존 | `image/sprite/raw/2026-06-13-vocal-ex-{pose}-f{N}.png` (14장) + concept 1장 |

---

## 2. Phase별 요약

### Phase 1 — Researching
- video-motion-analysis 스킬로 분석한 실제 가수 모션 어휘를 키프레임 소스로 사용:
  마이크 홀드(베이스) · 헤드 스웨이(L↔R) · 챈업(고음 클라이맥스) · 양팔 거상(피날레)
- 기존 세트 규격 파악: 192×192, idle/play, 글로벌 팔레트, Aseprite Hash JSON
- 글로벌 팔레트(`image/sprite/palette.json`) 재사용 → 기존 오케스트라 세트와 색 조화

### Phase 2a — 컨셉 (gpt-image-2)
- `image-gen.py generate --provider openai` 로 캐릭터 디자인 시트 1장 생성
- 1024×1024, 치비 픽셀아트 + 다크판타지 페어리테일 스타일(기존 세트 매칭)
- 정면/후면/노래 표정 썸네일까지 자동 포함 → reference로 이상적

### Phase 2b — 프레임 생성 (gpt-image-2 edit)
- 컨셉을 input_image reference로 고정하여 14프레임 `edit()` 생성 (캐릭터 일관성 ↑)
- 노래 모션 아크 설계:
  - **idle(6f)**: 마이크 가슴 · 호흡 · 미세 좌우 스웨이 (루프)
  - **play(8f)**: f0 마이크 들기 → f1 입가·좌향 → f2 정면 발성 → f3 턱 들기 →
    **f4 챈업 클라이맥스** → f5 지속음·우향 → f6 왼팔 상승 → **f7 양팔 거상 피날레**
- 파일럿 3프레임(idle f0 / play f0 / f4)로 그린 배경·일관성 선검증 후 전체 진행

### Phase 2c — 후처리 + 시트 (sprite-postprocess.py)
- HSV 그린키 매팅 → 알파 bbox 크롭 → 192×192 nearest 다운스케일 → 글로벌 팔레트 양자화 → 알파 이진화
- 액션별 가로 시트 + Aseprite Hash JSON 생성 (padding 8px)

### Phase 3 — Verify (자동 평가)
| 축 | 점수 | 근거 |
|----|------|------|
| S1 캐릭터 충실도 | **35/35** | 팔레트 드리프트 4.6% (<5%), 2액션·14프레임·reference |
| S2 애니메이션 품질 | **28/35** | 14프레임·2액션 (자동 채점 상한) |
| S3 공학 활용성 | **30/30** | 그린 잔여 0px · Aseprite JSON 2개 유효 · master index 존재 |
| **합계** | **93/100 · A** | |

---

## 3. 핵심 발견

1. **gpt-image-2 edit() 일관성**: 컨셉 시트를 모든 프레임의 reference로 고정하면 시드 파라미터 없이도
   캐릭터 디자인(머리/가운/마이크)이 14프레임 내내 안정적으로 유지됨 — Gemini 시드 고정의 대안.
2. **실제 영상 분석 → 모션 키프레임**: 추상적 idle/play가 아니라 실측 가수 동작(챈업·양팔 거상)을
   프레임에 매핑하니 노래 동작이 자연스럽게 읽힘. video-motion-analysis → Case S 파이프라인 유효.
3. **프레임 확장의 비용**: 8f→14f는 edit 호출 14회(+컨셉 1회). 파일럿 게이트로 스타일 선검증이 비용 안전장치.

---

## 4. 산출물 경로

```
image/openai/2026-06-13-vocal-ex-concept.png      # gpt2 컨셉 (reference)
image/sprite/raw/2026-06-13-vocal-ex-*.png        # raw 14프레임 + concept
design/sprite/output/vocal-ex/
├── idle.png  + idle.json     # 6프레임
├── play.png  + play.json     # 8프레임 (자연 노래 동작)
└── preview.html              # 애니메이션 프리뷰
```

## 5. 다음 단계 제안

- **_master 통합**: `character-boxes.json`에 vocal-ex 추가 → `assemble`로 오케스트라 마스터에 합류
- **Case W 연결(S→W ×1.3)**: 스프라이트 시트를 실제 게임/웹 캔버스 플레이어로 구현
- **추가 액션**: wave/bow/cheer 등 확장 (현재 idle/play 2액션)
