---
date: 2026-06-16T00:15:00
agent: sprite-animator
type: creation (Case S 스프라이트 생성)
mode: 수행부 (sprite-animation-flow Phase 2~5)
trigger: "진행하고 스프라이트 애니 생성까지 진행"
source: https://www.youtube.com/watch?v=Geh1ZEjkaeM
collection: itzy
provider: gpt-image-2 (OpenAI, edit + 고정 컨셉 reference)
pipeline: video-motion-analysis → Case S → Case W (sample16)
---

# ITZY 센터 댄서 — 14프레임 스프라이트 생성 (Phase 2~5)

## 실행 요약

[2026-06-15 영상 분석 로그](2026-06-15-17-00-itzy-center-dance-full-analysis.md)의 `dance-analysis.md`
키프레임 매핑을 입력으로, sprite-animation-flow 5 Phase 중 Phase 2~5를 수행했다.

| Phase | 내용 | 결과 |
|-------|------|------|
| 2. pilot | gpt-image-2 컨셉 시트 생성 → V암 포즈 edit 시범 | ✅ 정체성·green 배경 완벽, 게이트 통과 |
| 3. batch | 13프레임 백그라운드 생성 (play-f4는 파일럿 재활용) | ✅ ok=13 err=0 |
| 4. fix-pass | 14프레임 콘택트 시트 시각 진단 | ✅ 머리중복·여분팔다리·인접침범 0건 |
| 5. integrate | 192×192 후처리 → master 조립 → sample16 미러 + 플레이어 | ✅ S→W 완성 |

## 차별점 (사용자 요구: "한 명의 디테일한 댄스 풍부하게")

- 기존 vocal-ex: 단일 8초 구간 → idle 4f / play 4f.
- 이번 itzy-center: **0:00~2:14 전 구간** → idle **6f** + play **8f** = 14f, 도입부 베이스 동작부터
  V암 클라이맥스(①②) + 그랜드 피날레까지 댄스 아크 완성.

### 프레임 매핑 (dance-analysis.md 타임코드 기반)

| 액션 | 프레임 | 포즈 | 출처 TC |
|------|--------|------|---------|
| idle | f0~f5 | base / step-touch / reach / hip-sway / body-roll / power-stance | 0:18~0:32 |
| play | f0~f3 | triple-step / point+iso / slide-upper / push-pull | 0:42~1:04 |
| play | f4 | **V-arms 클라이맥스 ①** (파일럿) | 1:15 |
| play | f5 | freeze | 1:22 |
| play | f6 | **V-arms 릴레베 ②** (발끝) | 1:45 |
| play | f7 | **grand finale** (양팔 거상+후경) | 2:04 |

## 산출물

| 산출물 | 경로 |
|--------|------|
| 컨셉 reference | `image/sprite/itzy-center-concept.png` |
| raw 14프레임 | `image/sprite/raw_itzy/{idle,play}-f*.png` |
| per-char 팔레트 | `image/sprite/palette-itzy.json` (48색 적응) |
| 후처리 시트 | `design/sprite/output_itzy/itzy-center/{idle,play}.{png,json}` |
| master + index | `design/sprite/output_itzy/_master/` |
| 배포 미러 | `design/xaml/output/sample16/` (index.html + manifest.js + assets) |

## 평가 — design-evaluator Case S 공식 채점 (자동)

```
S1 캐릭터 충실도 : 35/35  (palette_drift_ratio 0.0)
S2 애니메이션 품질: 28/35
S3 공학적 활용성  : 30/30  (green_residual 0px, aseprite JSON valid ×2)
─────────────────────────────
총점: 93/100 (A등급)
```

자체 진단 플래그: head-dup 0 / intrusion 0 / chroma 0.

### RPG XP

```
기본 930 (93×10) × A등급 ×5 × Case S ×1.2 × S→W 파이프라인 ×1.3 = 7,254 XP
Lv.61 → Lv.62 (current_xp 3,894 / 7,900), total_designs 30
```

## 검증

- sample16 플레이어 Playwright 렌더 검증 — 콘솔 에러 0건(favicon 404 무해), 컨셉+idle/play 히어로 + 14프레임 필름스트립 정상.

## 다음 단계 제안

1. **S2 보강(28→만점)**: idle/play loop SSIM 측정 + frame[0]↔frame[N-1] 연결성 개선 (현재 가변프레임이라 loop 부드러움 여지).
2. **per-character 팔레트 효과 검증 완료** — 골드/스킨/블랙 타이츠 드리프트 0.0 (모던 색상 가이드 v2.9.1 재입증).
3. **sample15 통합 후보**: itzy 그룹을 통합 자산 플레이어(sample15)에 합류시켜 그룹 필터 탭 확장.
4. **멤버 신원 특정**: 와이드샷 위주라 개인 식별 불가 → 자막/크레딧 조사 시 desc 보강 가능.
