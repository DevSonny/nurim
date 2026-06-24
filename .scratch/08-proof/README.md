# Proof 공유 (커뮤니티 피드)

## What to build

Proof(달성 또는 성장 기록) 작성 및 커뮤니티 피드 표시.

## Subtasks

### 1. Proof 작성 및 커뮤니티 피드 페이지

/community 피드 페이지, Proof 작성 모달, Proof 목록 표시.

**Acceptance criteria:**
- [ ] /community 페이지 생성
- [ ] Proof 목록 표시 (사용자명, 내용, 타임스탠프, 프로필 링크)
- [ ] 무한 스크롤 또는 페이지네이션
- [ ] Proof 작성 모달 (텍스트 입력, 옵션: 스크린샷)
- [ ] 개인 Proof만 삭제 가능 (다른 사용자 Proof는 읽기만)
- [ ] 로딩 및 에러 상태

**Blocked by:**
- 07-achievement / Subtask 2
- 02-google-oauth / Subtask 2

---

### 2. Proof 저장 및 피드 API

Proof 데이터베이스 테이블, POST /api/proof 엔드포인트, GET /api/proof (피드) 엔드포인트.

**Acceptance criteria:**
- [ ] Proof 테이블 생성 (id, user_id, content, screenshot_url, created_at)
- [ ] POST /api/proof - Proof 저장
- [ ] GET /api/proof - 전체 Proof 목록 (최신순, 페이지네이션)
- [ ] GET /api/proof?user_id=[id] - 특정 사용자 Proof만 조회
- [ ] DELETE /api/proof/[id] - Proof 삭제 (소유자만)
- [ ] 트랜잭션으로 사용자별 데이터 격리

**Blocked by:** 03-core-crud / Subtask 2

---

## Overall Acceptance Criteria

- [ ] Proof 작성 및 저장
- [ ] 커뮤니티 피드 표시
- [ ] 개인 데이터 격리 (RLS)
