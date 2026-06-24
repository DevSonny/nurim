# 달성 트리거 및 Core 흡수 애니메이션

## What to build

Sub-Orbit 달성 시 트리거 (수동 + 자동), Core 흡수 애니메이션 구현.

## Subtasks

### 1. 달성 트리거 (수동 + 자동) 구현

Sub-Orbit 달성 버튼 (수동), Pulse 누적값 도달 시 자동 달성 로직, 상태 변경.

**Acceptance criteria:**
- [ ] Sub-Orbit 상세 페이지에 '달성' 버튼
- [ ] 버튼 클릭 시 PATCH /api/sub-orbit/[id]/achieve 호출
- [ ] Sub-Orbit status 변경 (in_progress → completed)
- [ ] Pulse 누적값이 목표값 도달 시 자동 달성
- [ ] 달성 시 timestamp 기록 (achieved_at)
- [ ] 달성 상태 UI 변경 (체크마크, 비활성화 등)

**Blocked by:** 05-pulse / Subtask 2

---

### 2. Core 흡수 애니메이션

Sub-Orbit 달성 시 노드가 Core로 흡수되는 3D 애니메이션, 애니메이션 완료 후 상태 변경.

**Acceptance criteria:**
- [ ] 달성 트리거 시 노드 → Core 방향으로 이동 애니메이션
- [ ] 부드러운 병합 효과 (1~2초)
- [ ] 애니메이션 중 사용자 인터랙션 제한
- [ ] 애니메이션 완료 후 노드 사라짐
- [ ] 대시보드로 자동 리디렉션 (옵션)
- [ ] 달성한 목표 이력 조회 가능 (대시보드에서 '완료된 목표' 탭)

**Blocked by:**
- Subtask 1
- 06-visualization / Subtask 2

---

## Overall Acceptance Criteria

- [ ] 수동/자동 달성 동작
- [ ] 흡수 애니메이션 부드러움
- [ ] 달성 상태 데이터베이스 저장
