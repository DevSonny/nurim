# Pulse 입력 및 저장

## What to build

Sub-Orbit 페이지에서 Pulse 입력 폼, 데이터 저장, 누적값 계산 및 저장.

## Subtasks

### 1. Sub-Orbit 상세 페이지 및 Pulse 폼 UI

/app/dashboard/[coreId]/[orbitId]/[subOrbitId] 페이지에서 Sub-Orbit 상세 정보, Pulse 입력 폼, 기록 목록 표시.

**Acceptance criteria:**
- [ ] Sub-Orbit 상세 정보 표시 (제목, 카테고리, 목표값, 현재값, 단위)
- [ ] Pulse 입력 폼 (값, 날짜, 설명)
- [ ] 기록된 Pulse 목록 (최신순, 삭제 버튼 포함)
- [ ] 목표값 대비 진행률 표시 (%)
- [ ] 로딩, 에러 상태 처리

**Blocked by:** 04-dashboard-ui / Subtask 3

---

### 2. Pulse 저장 및 누적값 계산

POST /api/pulse 엔드포인트, Pulse 데이터베이스 테이블, Sub-Orbit의 current_value 자동 업데이트.

**Acceptance criteria:**
- [ ] Pulse 테이블 생성 (id, sub_orbit_id, user_id, value, date, description, created_at)
- [ ] POST /api/pulse 엔드포인트 구현
- [ ] Pulse 저장 시 Sub-Orbit의 current_value 자동 누적
- [ ] GET /api/sub-orbit/[id]/pulse - 특정 Sub-Orbit의 모든 Pulse 조회
- [ ] DELETE /api/pulse/[id] - Pulse 삭제 시 누적값 재계산
- [ ] 트랜잭션으로 데이터 일관성 보장

**Blocked by:** 03-core-crud / Subtask 2

---

### 3. Pulse 입력 폼 제출 및 실시간 업데이트

Pulse 폼 제출 시 API 호출, UI 실시간 업데이트, 누적값 및 진행률 반영.

**Acceptance criteria:**
- [ ] 폼 제출 시 POST /api/pulse 호출
- [ ] 성공 시 폼 초기화
- [ ] 실시간 Pulse 목록 갱신
- [ ] 누적값 업데이트 (current_value)
- [ ] 진행률 바 애니메이션 업데이트
- [ ] 로딩 상태 중 제출 버튼 비활성화

**Blocked by:**
- Subtask 1
- Subtask 2

---

## Overall Acceptance Criteria

- [ ] Pulse 입력 및 저장 동작
- [ ] 누적값 자동 계산
- [ ] 진행률 실시간 표시
