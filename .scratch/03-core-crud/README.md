# Core/Orbit/Sub-Orbit 데이터 모델 + CRUD

## What to build

데이터베이스 스키마 정의 (Core, Orbit, Sub-Orbit 테이블), API Routes 구현 (생성/조회/수정/삭제).

## Subtasks

### 1. Core/Orbit/Sub-Orbit 테이블 생성

Supabase에 Core, Orbit, Sub-Orbit 테이블 생성, 컬럼 정의, foreign key 관계 설정.

**Acceptance criteria:**
- [ ] Core 테이블 (id, user_id, title, description, created_at, updated_at, status)
- [ ] Orbit 테이블 (id, core_id, user_id, title, description, created_at)
- [ ] Sub-Orbit 테이블 (id, orbit_id, user_id, title, category, target_value, unit, current_value, status, created_at)
- [ ] Foreign key 관계 설정 (Orbit → Core, Sub-Orbit → Orbit)
- [ ] RLS 정책: user_id별 데이터 격리
- [ ] Supabase에서 테이블 조회 확인

**Blocked by:** 01-project-setup / Subtask 2

---

### 2. Core/Orbit/Sub-Orbit API Routes 구현

Next.js API Routes에서 Core/Orbit/Sub-Orbit의 CRUD 엔드포인트 구현.

**Acceptance criteria:**
- [ ] POST /api/core - Core 생성
- [ ] GET /api/core - 사용자의 모든 Core 조회
- [ ] GET /api/core/[id] - 특정 Core 상세 조회 (Orbit 포함)
- [ ] PATCH /api/core/[id] - Core 수정
- [ ] POST /api/orbit - Orbit 생성
- [ ] POST /api/sub-orbit - Sub-Orbit 생성
- [ ] 오류 처리 (400, 401, 404 등)
- [ ] Supabase 클라이언트를 통한 DB 쿼리

**Blocked by:**
- Subtask 1
- 02-google-oauth / Subtask 2

---

### 3. API 응답 타입 정의 및 검증

TypeScript 타입 정의 (Core, Orbit, Sub-Orbit), API 응답 스키마 정의, 입력 검증.

**Acceptance criteria:**
- [ ] TypeScript 인터페이스 정의 (Core, Orbit, Sub-Orbit types)
- [ ] API 응답 포맷 통일 (success, data, error 구조)
- [ ] POST 요청 body 검증 (required fields, type checking)
- [ ] 에러 메시지 일관성
- [ ] Swagger/OpenAPI 문서 (선택사항)

**Blocked by:** Subtask 2

---

## Overall Acceptance Criteria

- [ ] 모든 CRUD 엔드포인트 동작 확인
- [ ] TypeScript 타입 일관성
- [ ] Supabase RLS 정책 동작 확인
