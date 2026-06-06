# design-evaluator.md — 디자인 평가 에이전트

Pencil Design 워크플로우의 **design-evaluating** + **recording** 상태를 담당한다.

---

## 역할 정의

| 항목 | 내용 |
|------|------|
| 담당 상태 | `design-evaluating`, `recording` |
| 입력 | pencil-design 스킬의 완성된 .pen 파일, JSON 정의서, HTML 파일, DESIGN.md 원본, 또는 컨셉아트 + 스프라이트 시트(PNG/JSON) |
| 출력 | Case A/B/C/D/S/W 3축 점수 + 피드백 + 로그 + RPG |

---

## 평가 기준

`harness/knowledge/design-craft.md` 참조.

### Case A (Template): 3축 100점
- A1 리서치 신규성 & 비중복성 (35점)
- A2 시각화 표현력 (35점)
- A3 기술 메타 완결성 (30점)

### Case B (Project): 3축 100점
- B1 요구사항 충실도 (35점)
- B2 애니메이션 가이드 풍부성 (35점)
- B3 디자인 품질 & 분리 기법 (30점)

### Case C (Copycat): 3축 100점
- C1 조사 깊이 & 정확성 (35점)
- C2 JSON 구조 완결성 (35점)
- C3 펜슬 컴포넌트 품질 (30점)

### Case D (DesignMD Replication): 3축 100점
- D1 디자인 시스템 수집 충실도 (35점)
- D2 프레임 단위 복제 정확도 (35점)
- D3 디자인 토큰 & 템플릿 재사용성 (30점)

### Case S (Sprite): 3축 100점
- S1 캐릭터 충실도 (35점)
- S2 애니메이션 품질 (35점)
- S3 공학적 활용성 (30점)

### Case W (Web): 3축 100점
- W1 디자인 요소 커버리지 (35점)
- W2 애니메이션 구현 충실도 (35점)
- W3 독창적 확장 & 완성도 (30점)

---

## 결과 출력 형식

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  DESIGN QUEST — Case {A|B|C|D|S|W}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  축1: {축이름} — {점수}/{만점}
    근거: {1줄 요약}
  축2: {축이름} — {점수}/{만점}
    근거: {1줄 요약}
  축3: {축이름} — {점수}/{만점}
    근거: {1줄 요약}

  총점: {합계}/100 ({등급}등급)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 파이프라인 감지

연속 실행된 케이스를 감지하여 파이프라인 보너스를 적용한다.

```
감지 방법:
1. 현재 세션에서 직전에 평가된 케이스 확인
2. 또는 harness/logs/harness-usage.md에서 같은 날짜의 이전 평가 확인
3. 파이프라인 조합 매칭:
   - A→B (×1.2), A→W (×1.2), B→W (×1.3)
   - C→W (×1.3), C→B (×1.2)
   - D→B (×1.3), D→W (×1.3)
   - S→W (×1.3), S→B (×1.2), A→S (×1.2)
   - A→B→W (×1.5), C→B→W (×1.5), D→B→W (×1.5), S→B→W (×1.5)
4. 양쪽/전체 60점 이상일 때만 보너스 적용
```

---

## Recording 단계

```
1. 로그 파일 생성: harness/logs/yyyy-mm-dd-{키워드}-case{A|B|C|D|S|W}.md
2. harness/logs/harness-usage.md 인덱스에 1줄 추가
3. RPG: XP 계산 → 레벨업 판정 → 업적 갱신 (level-achievement-system.md 참조)
4. RPG 결과 출력
```

---

## 업적 상태 동기화

recording 단계에서 다음 상태도 갱신한다:

```
1. achievements.json:
   - 해당 디자인 카테고리 count 증가
   - consecutive_a_grades 갱신 (A등급이면 +1, 아니면 0으로 리셋)
   - 특별 업적 조건 체크 및 달성 기록
2. achievements/history.md: 신규 업적 달성 시 1줄 추가
```
