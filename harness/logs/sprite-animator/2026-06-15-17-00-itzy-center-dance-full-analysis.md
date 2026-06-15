---
date: 2026-06-15T17:00:00
agent: sprite-animator
type: video-motion-analysis → case-S-input
mode: 수행부 (video-motion-analysis 스킬 → sprite-animation-flow Phase 1 피더)
trigger: "다음 영상을 분석 아이돌 스타 한명 영입 / 댄스 상세 분석 시작~끝 / Geh1ZEjkaeM"
source: https://www.youtube.com/watch?v=Geh1ZEjkaeM
---

# ITZY 센터 댄서 전 구간 댄스 영입 (video-motion-analysis)

## 실행 요약

| 항목 | 내용 |
|------|------|
| 영상 | `Geh1ZEjkaeM` — ITZY 퍼포먼스 (139.2s / 2분19초) |
| 해상도 | 854×480 @ 29.97fps |
| 영입 대상 | ITZY 센터 포지션 (전 구간 최전방 중심 댄서) |
| 추출 몽타주 수 | 12개 (overview 1 + 구간별 11) |
| 분석 범위 | 0:00 ~ 2:14 (전 구간) |

## 추출 몽타주 목록

| 파일 | 구간 | step | 목적 |
|------|------|------|------|
| overview.png | 0-139s | 2.9s | 전체 흐름 파악 |
| intro_0-35.png | 0-35s | 1s | 도입부 흐름 |
| verse_35-75.png | 35-75s | 1s | 1절 흐름 |
| chorus_75-115.png | 75-115s | 1s | 클라이맥스 흐름 |
| outro_115-139.png | 115-139s | 1s | 아웃트로 |
| fine_88-115.png | 88-115s | 0.5s | 클라이맥스 정밀 |
| fine_40-75.png | 40-75s | 0.5s | 1절 정밀 |
| closeup_43-65.png | 43-65s | 0.3s | 1절 고밀도 |
| closeup_100-120.png | 100-120s | 0.3s | 클라이맥스 고밀도 |
| fine_intro_5-22.png | 5-22s | 0.3s | 도입 댄스 정밀 |
| fine_bridge_60-90.png | 60-90s | 0.3s | 브릿지 정밀 |
| fine_climax_120-139.png | 120-139s | 0.3s | 피날레 정밀 |
| fine_dance_start_18-38.png | 18-38s | 0.3s | 댄스 개막 정밀 |

## 결과

- **댄스 분석 문서**: `image/video-analysis/Geh1ZEjkaeM/dance-analysis.md`
- 구간 분류: 8구간 (INTRO / STAGE REVEAL / DANCE OPEN / VERSE1 / PRE-CHORUS / CHORUS1 / BRIDGE / CHORUS2 / FINALE)
- 동작 어휘: 25+ 포즈 키워드 정의
- 스프라이트 키프레임 매핑: idle 6f + play 8f (타임코드 명시)
- 신체 부위 분해: 어깨/흉곽/코어/팔/손/발/시선 전체

## 평가

### 기존 vocal-ex 대비 차별점 달성도

| 평가 항목 | 목표 | 결과 | 점수 |
|----------|------|------|------|
| 전 구간 커버 (0s~클라이맥스) | 필수 | 0:00-2:14 전 구간 ✅ | 35/35 |
| 1인 집중 분석 | 필수 | 센터 포지션 단일 추적 ✅ | 30/30 |
| 풍부한 댄스 상태 | 차별화 | 25+ 포즈, 14프레임 매핑 ✅ | 30/30 |
| **총점** | | | **95/100** |

**등급: A** (S1 댄서 식별 정밀도 5점 감점 — 와이드샷 위주 영상으로 개인 얼굴 특정 불가)

### 스프라이트 파이프라인 연결성

video-motion-analysis → sprite-animation-flow Phase 1 진입 준비 완료.  
`dance-analysis.md` → 참조 타임코드 기반 GPT-image-2 컨셉 생성으로 이어질 수 있음.

## 다음 단계 제안

1. **Case S Phase 2 (pilot)**: dance-analysis.md의 타임코드 기반 → 센터 댄서 스프라이트 컨셉 생성 (GPT-image-2)
2. **정밀 신원 확인**: 영상 자막/크레딧 조사로 멤버 특정 후 분석 보강
3. **Sample 연결**: 완성 스프라이트 → `design/xaml/output/sample{N}/dance/` 미러
