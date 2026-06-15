---
date: 2026-06-16T00:35:00
agent: sprite-animator
type: enhancement (Case S 액션 추가)
mode: 수행부 (sprite-animation-flow Phase 1~5, 증분)
trigger: "50~60초 구간의 댄스가 클라이막스 구간 이 구간 파악해 playex 프레임을 추가"
source: https://www.youtube.com/watch?v=Geh1ZEjkaeM (0:50~1:00)
collection: itzy / character: itzy-center
provider: gpt-image-2 (edit + 고정 컨셉 reference)
---

# ITZY 센터 댄서 — playex(50~60초 클라이맥스 그루브) 8프레임 추가

## 실행 요약

사용자 지정 클라이맥스 구간(0:50~1:00)을 0.25s 정밀 재추출하여 풀그룹 동기화
고에너지 댄스 브레이크의 동작 어휘를 뽑고, 기존 itzy-center에 신규 액션 `playex` 8프레임을 추가했다.

| 단계 | 내용 |
|------|------|
| 영상 재분석 | `climax_50-60.png`(0.3s) · `climax_53-58.png`(0.25s) 추출·판독 |
| 어휘 도출 | 대각포인트→크로스스윕→로우드롭→스냅팝→헤어휩턴→오버헤드→힙히트→파워액센트 |
| 배치 생성 | gpt-image-2 edit 8프레임 (f7은 행 발생 → 단독 재호출로 복구) |
| 진단 | head-dup 0 · intrusion 0 · chroma 0 (헤어휩 f4 머리비산까지 정상) |
| 후처리/조립 | 192×192 시트 → master 재조립(idle,play,playex) |
| 통합 | sample16 manifest + 플레이어에 playex 히어로 + 필름스트립 추가 |

## play vs playex 차별

- **play (8f)**: 0:00~2:14 전 구간 **서사 아크** (도입→V암 클라이맥스→피날레).
- **playex (8f) ⭐**: 0:50~1:00 한 패시지 **군무 정점 그루브 브레이크** — 날카로운 액센트 루프.
- sample16에서 별도 액션으로 토글 재생. dance-analysis.md §3-CLIMAX 신설.

## 프레임 매핑 (0:50~1:00)

| f | 포즈 | TC |
|---|------|----|
| 0 | 날카로운 대각 포인트 | ~50s |
| 1 | 크로스바디 스윕+트래블 | ~52s |
| 2 | 로우 그루브 드롭(와이드 스쿼트) | ~53.5s |
| 3 | 스냅업 체스트 팝 | ~54.5s |
| 4 | 헤어휩 하프 턴 | ~55.5s |
| 5 | 더블암 오버헤드 리치 | ~56.5s |
| 6 | 샤프 힙히트 어티튜드 | ~57s |
| 7 | 파워스탠스 프리즈 액센트 | ~58s |

## 산출물 갱신

| 산출물 | 경로 |
|--------|------|
| playex 시트 | `design/sprite/output_itzy/itzy-center/playex.{png,json}` |
| master(3액션) | `design/sprite/output_itzy/_master/` |
| 배포 미러 | `design/xaml/output/sample16/` (playex 자산 + 플레이어 갱신) |
| 분석 보강 | `image/video-analysis/Geh1ZEjkaeM/dance-analysis.md` §3-CLIMAX |

## 평가 — design-evaluator Case S (자동, 3액션 22프레임)

```
S1 35/35 (drift 0.0) · S2 28/35 · S3 30/30 (green 0px · aseprite ×3)
총점 93/100 (A등급) · frames_total 22 (idle6 + play8 + playex8)
```

### RPG XP (인핸스먼트)

```
Case S A등급 8프레임 액션 추가 = +3,000 XP (인핸스먼트, 동일 캐릭터 → designs 미증가)
Lv.62 유지 (current_xp 6,894 / 7,900)
```

## 검증

- sample16 Playwright 렌더 — 콘솔 에러 0(favicon 무해), 히어로 4종(concept/idle/play/playex) + 22프레임 필름스트립 정상.

## 다음 단계 제안

1. **playex loop 매끄러움**: f7(파워 액센트)→f0(대각 포인트) 연결 SSIM 측정으로 S2 보강.
2. **추가 클라이맥스 구간**: 1:45~2:00(Chorus 2 정점)도 동일 방식 playex2 후보.
3. **sample16 배포**: `/pencil-deploy`로 GitHub Pages 게시(S→W 라이브).
