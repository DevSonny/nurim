# 대시보드 기본 UI (Core/Orbit/Sub-Orbit 생성)

## What to build

로그인 후 대시보드 페이지, Core 목록 표시, Core/Orbit/Sub-Orbit 생성 폼.

## Subtasks

### 1. Core 목록 및 상세 페이지 UI

/app/dashboard/page.tsx에서 Core 목록 표시, Core 선택 시 상세 페이지, Orbit 목록 표시.

**Acceptance criteria:**
- [ ] Core 목록 렌더링 (카드 형식: 제목, 생성일, 상태)
- [ ] Core 클릭 시 상세 페이지로 이동 (/app/dashboard/[coreId])
- [ ] 상세 페이지에서 해당 Core의 Orbit 목록 표시
- [ ] 로딩 상태 표시 (skeleton 또는 spinner)
- [ ] 에러 메시지 표시
- [ ] 빈 상태 (Empty State): Core 없을 때 "새로운 목표를 만들어보세요" 메시지

**Blocked by:**
- 03-core-crud / Subtask 2
- 02-google-oauth / Subtask 2

---

### 2. Core 생성 폼 모달

Core 생성 폼 (모달 또는 새 페이지), 입력 필드 (제목, 설명), 제출 시 API 호출.

**Acceptance criteria:**
- [ ] '새 Core 만들기' 버튼
- [ ] 모달 또는 폼 페이지에 title, description 입력
- [ ] 제출 시 POST /api/core 호출
- [ ] 성공 시 목록에 새 Core 추가
- [ ] 에러 시 사용자에게 피드백
- [ ] 취소 버튼

**Blocked by:** Subtask 1

---

### 3. Orbit/Sub-Orbit 생성 폼

Core 상세 페이지에서 Orbit 생성 폼, 선택한 Orbit 아래 Sub-Orbit 생성 폼.

**Acceptance criteria:**
- [ ] Orbit 생성 폼 (제목, 설명)
- [ ] Sub-Orbit 생성 폼 (제목, 카테고리 선택, 목표값, 단위 직접 입력)
- [ ] 카테고리 프리셋 드롭다운 (공부, 운동, 독서 등)
- [ ] 단위 입력 필드 (시간, 페이지, 회, km 등 자유 입력)
- [ ] 제출 시 POST /api/orbit, POST /api/sub-orbit 호출
- [ ] 계층 구조 시각적 표현

**Blocked by:** Subtask 1

---

## Overall Acceptance Criteria

- [ ] Core 목록 표시 및 조회
- [ ] Core/Orbit/Sub-Orbit 생성 가능
- [ ] UI 반응형 및 에러 처리
