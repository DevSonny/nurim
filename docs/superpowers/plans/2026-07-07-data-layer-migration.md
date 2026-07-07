# 데이터 레이어 마이그레이션 (Plan 2/2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 `localStorage` 기반 상태 관리(`lib/store.ts`)를 완전히 걷어내고, Drizzle ORM과 REST API를 이용해 DB(Turso)와 연동되는 클라이언트-서버 구조로 교체합니다.

**Architecture:** Next.js App Router의 Route Handlers를 이용해 REST API를 구현하고, 클라이언트에서는 SWR(또는 Fetch)을 통해 데이터를 가져옵니다. 기존 `lib/store.ts`의 로직은 API 클라이언트(`lib/api-client.ts`)와 커스텀 훅(`lib/use-data.ts`)으로 대체됩니다.

**Tech Stack:** Next.js 15, SWR, Drizzle ORM, libSQL

## Global Constraints

- 이모지 문자 UI/문서(README 포함)에 절대 사용 금지 — 아이콘은 PNG 파일로
- 모든 API 라우트는 `auth()` 세션 검증 후 `session.user.id`를 사용하여 타 유저 데이터 접근을 서버 레벨에서 격리해야 함
- TypeScript strict 모드 유지
- `app/api/og/route.tsx` 건드리지 않음

---

### Task 1: API 라우트 구현 (Nodes, Pulses)

**Files:**
- Create: `app/api/nodes/route.ts`
- Create: `app/api/nodes/[id]/route.ts`
- Create: `app/api/nodes/[id]/achieve/route.ts`
- Create: `app/api/pulses/route.ts`
- Create: `app/api/pulses/[id]/route.ts`

**Interfaces:**
- Produces: `GET /api/nodes`, `POST /api/nodes`, `PATCH /api/nodes/[id]`, `DELETE /api/nodes/[id]`, `PATCH /api/nodes/[id]/achieve`
- Produces: `GET /api/pulses`, `POST /api/pulses`, `PATCH /api/pulses/[id]`, `DELETE /api/pulses/[id]`

- [ ] **Step 1: Nodes CRUD 구현**
- `app/api/nodes/route.ts` (GET, POST) 및 `app/api/nodes/[id]/route.ts` (PATCH, DELETE) 구현. Drizzle ORM을 사용하여 DB(`nodes` 테이블) 조작. 모든 조작은 `session.user.id` 기반 필터링 포함.
- [ ] **Step 2: Nodes 달성(Achieve) 라우트 구현**
- `app/api/nodes/[id]/achieve/route.ts` (PATCH) 구현. `{ achieved: boolean }`을 바디로 받아 `achievedAt` 필드 업데이트.
- [ ] **Step 3: Pulses CRUD 구현**
- `app/api/pulses/route.ts` (GET, POST) 및 `app/api/pulses/[id]/route.ts` (PATCH, DELETE) 구현. Drizzle ORM을 사용하여 DB(`pulses` 테이블) 조작. 
- [ ] **Step 4: 빌드 및 타입 체크 검증**
`npm run build && npx tsc --noEmit` 실행하여 문법 오류 없는지 확인.
- [ ] **Step 5: Commit**
`git add app/api/nodes app/api/pulses` 후 `git commit -m "feat: add nodes and pulses API routes"`

---

### Task 2: API 라우트 구현 (Graph, Proofs)

**Files:**
- Create: `app/api/graph/route.ts`
- Create: `app/api/proofs/route.ts`
- Create: `app/api/proofs/[id]/react/route.ts`

**Interfaces:**
- Produces: `GET /api/graph` (returns `{ nodes, pulses }` for the current user)
- Produces: `GET /api/proofs`, `POST /api/proofs`, `POST /api/proofs/[id]/react`

- [ ] **Step 1: Graph 라우트 구현**
- `app/api/graph/route.ts` (GET) 구현. 사용자의 모든 nodes와 pulses를 조인 또는 병렬 쿼리로 한 번에 가져와 반환.
- [ ] **Step 2: Proofs 라우트 구현**
- `app/api/proofs/route.ts` (GET, POST) 구현. `proofs` 테이블 조회 및 생성.
- [ ] **Step 3: Proof React 라우트 구현**
- `app/api/proofs/[id]/react/route.ts` (POST) 구현. `reactions` 테이블에 `{ reactionType }` 추가 또는 토글.
- [ ] **Step 4: 빌드 및 타입 체크 검증**
`npm run build && npx tsc --noEmit` 실행하여 문법 오류 확인.
- [ ] **Step 5: Commit**
`git add app/api/graph app/api/proofs` 후 `git commit -m "feat: add graph and proofs API routes"`

---

### Task 3: API 클라이언트 및 커스텀 훅(SWR) 구현

**Files:**
- Create: `lib/api-client.ts`
- Create: `lib/use-data.ts`

**Interfaces:**
- Consumes: Task 1, 2 API Routes
- Produces: 클라이언트 컴포넌트에서 사용할 `useGraph()`, `useProofs()`, `api` 헬퍼 함수들

- [ ] **Step 1: SWR 설치**
`npm install swr` 실행.
- [ ] **Step 2: `lib/api-client.ts` 구현**
fetch 래퍼 및 뮤테이션 함수(POST/PATCH/DELETE) 구현 (`api.nodes.create`, `api.pulses.create` 등).
- [ ] **Step 3: `lib/use-data.ts` 구현**
`useSWR('/api/graph', fetcher)` 기반의 `useGraph()` 훅을 만들어 기존 컴포넌트들이 노드와 펄스 데이터를 리액티브하게 가져올 수 있도록 함. 반환 타입은 `{ nodes, pulses, mutate }`
- [ ] **Step 4: 빌드 및 타입 체크 검증**
`npm run build && npx tsc --noEmit` 실행.
- [ ] **Step 5: Commit**
`git add package.json package-lock.json lib/api-client.ts lib/use-data.ts` 후 `git commit -m "feat: add api client and SWR hooks"`

---

### Task 4: 기존 Store 제거 및 의존성 주입 구조로 변경

**Files:**
- Delete: `lib/store.ts`
- Modify: `lib/aggregate.ts`

**Interfaces:**
- Consumes: 클라이언트 컴포넌트에서 데이터 전달
- Produces: `lib/aggregate.ts`가 자체적으로 `getNodes()`를 호출하지 않고 인자로 받도록 수정 (`getStreak(nodes, pulses)` 등)

- [ ] **Step 1: `lib/store.ts` 삭제**
- [ ] **Step 2: `lib/aggregate.ts` 리팩토링**
기존에 `getNodes()`, `getPulses()`를 내부적으로 호출하던 함수들(`getProgress`, `getCategoryTotals` 등)을 모두 `(nodes, pulses, ...)` 파라미터로 데이터를 직접 받도록(Dependency Injection) 수정.
- [ ] **Step 3: 빌드 및 컴파일 에러 유발 확인**
이 시점에서 `npm run build`를 하면 컴포넌트들에서 참조 에러가 발생해야 정상임.
- [ ] **Step 4: Commit**
`git add lib/store.ts lib/aggregate.ts` 후 `git commit -m "refactor: remove store and modify aggregate signature"`

---

### Task 5: 컴포넌트 마이그레이션

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `app/signal/page.tsx`
- Modify: `app/stats/page.tsx`
- Modify: `app/settings/page.tsx`
- Modify: `components/solar/SolarSystemScene.tsx`
- Modify: `components/mandala/MandalaView.tsx`

**Interfaces:**
- Consumes: `useGraph()` from `lib/use-data.ts`, `api` from `lib/api-client.ts`, modified `lib/aggregate.ts` functions.

- [ ] **Step 1: `app/dashboard/page.tsx` 마이그레이션**
`useGraph()`를 호출하여 `nodes`, `pulses` 상태를 가져오고 (로딩 중일 땐 Skeleton 또는 null 반환), 이를 `lib/aggregate.ts` 함수들에 전달. 
- [ ] **Step 2: 기타 페이지 및 컴포넌트 마이그레이션**
`signal`, `stats`, `settings` 페이지와 `SolarSystemScene`, `MandalaView` 컴포넌트의 데이터를 `useGraph()` 기반 및 컴포넌트 props 기반으로 모두 교체. 저장 및 수정 액션은 `api-client.ts`의 뮤테이션 함수 호출 후 `mutate('/api/graph')`로 데이터 갱신.
- [ ] **Step 3: 전체 빌드 및 검증**
`npm run build && npx tsc --noEmit` 실행. 에러가 없어야 함.
- [ ] **Step 4: Commit**
수정된 컴포넌트들 add 후 `git commit -m "refactor: migrate UI to use API and SWR"`
