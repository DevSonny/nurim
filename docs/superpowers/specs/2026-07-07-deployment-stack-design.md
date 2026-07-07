# 배포 스택 교체 설계 — Turso + Vercel + Auth.js

**날짜**: 2026-07-07  
**상태**: 승인됨  
**배경**: Oracle Cloud PostgreSQL 사용 불가로 인한 전체 인프라 스택 교체

---

## 결정 요약

| 레이어 | 기존 (폐기) | 신규 |
|--------|------------|------|
| 호스팅 | Cloudflare Pages + Workers | Vercel |
| DB | Oracle Cloud PostgreSQL | Turso (libSQL) |
| DB 연결 | Cloudflare Hyperdrive | @libsql/client (직접 연결) |
| ORM | 없음 | Drizzle ORM |
| Auth | 미구현 (예정만) | Auth.js v5 + Google OAuth |
| Auth-DB | — | @auth/drizzle-adapter |

**선택 기준**: 무료 티어 가성비 최대화 (Turso: 9GB, 1B row reads/month 무료)

---

## 제거 대상

### 패키지
```bash
npm uninstall @cloudflare/next-on-pages wrangler
```

### 파일
- `wrangler.toml` 삭제
- `next.config.ts` — Cloudflare 관련 옵션 제거
- `lib/store.ts` — localStorage 기반 상태관리 전면 교체 (DB 기반으로)

---

## 추가 대상

### 패키지
```bash
npm install @libsql/client drizzle-orm next-auth@beta @auth/drizzle-adapter
npm install -D drizzle-kit
```

### 파일 구조 추가
```
lib/
  db/
    index.ts          # Turso 클라이언트 + Drizzle 인스턴스
    schema.ts         # 전체 Drizzle 스키마 정의
  auth.ts             # Auth.js 설정 (Google provider + Drizzle adapter)
app/
  api/
    auth/[...nextauth]/route.ts   # Auth.js 핸들러
    nodes/route.ts
    nodes/[id]/route.ts
    nodes/[id]/achieve/route.ts
    pulses/route.ts
    pulses/[id]/route.ts
    graph/route.ts
    proofs/route.ts
    proofs/[id]/react/route.ts
middleware.ts         # 인증 필요 라우트 보호
drizzle.config.ts     # Drizzle Kit 설정
```

---

## DB 스키마

### Auth 테이블 (Auth.js Drizzle Adapter 표준)

```typescript
// users, accounts, sessions, verificationTokens
// — @auth/drizzle-adapter 표준 스키마 그대로 사용
```

### 앱 테이블

```typescript
// nodes
export const nodes = sqliteTable('nodes', {
  id:         text('id').primaryKey(),             // cuid
  userId:     text('user_id').notNull(),           // FK → users.id
  type:       text('type').notNull(),              // 'core' | 'orbit' | 'sub'
  label:      text('label').notNull(),
  orbitIdx:   integer('orbit_idx').notNull(),      // 색상 일관성 유지용
  parentId:   text('parent_id'),                   // nullable, FK → nodes.id
  goalType:   text('goal_type'),                   // 'accumulation' | 'repetition'
  target:     real('target'),
  unit:       text('unit'),
  period:     text('period'),                      // 'day' | 'week' | 'month'
  achievedAt: integer('achieved_at'),              // unix ms, nullable
  createdAt:  integer('created_at').notNull(),
})

// pulses
export const pulses = sqliteTable('pulses', {
  id:        text('id').primaryKey(),
  nodeId:    text('node_id').notNull(),            // FK → nodes.id
  userId:    text('user_id').notNull(),            // FK → users.id (직접 저장, join 없이 격리)
  date:      text('date').notNull(),               // YYYY-MM-DD
  value:     real('value').notNull(),              // 음수 허용 (money 지출)
  kind:      text('kind'),                         // 'score'|'time'|'check'|'money'|'progress'
  memo:      text('memo'),
  createdAt: integer('created_at').notNull(),
})

// proofs
export const proofs = sqliteTable('proofs', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').notNull(),
  nodeId:    text('node_id'),                      // nullable — Core 전체 공유 가능
  body:      text('body').notNull(),
  createdAt: integer('created_at').notNull(),
})

// reactions
export const reactions = sqliteTable('reactions', {
  id:           text('id').primaryKey(),
  proofId:      text('proof_id').notNull(),
  userId:       text('user_id').notNull(),
  reactionType: text('reaction_type').notNull(),   // 'fire'|'flex'|'star'|'heart'|'check'
  createdAt:    integer('created_at').notNull(),
}, (t) => ({
  uniq: unique().on(t.proofId, t.userId, t.reactionType),  // 중복 반응 방지
}))
```

> **UI 원칙**: 이모지 문자 사용 금지. reactionType은 PNG 아이콘으로 렌더링.
> 예: `/public/icons/reaction-fire.png`

---

## Auth 흐름

```
1. 사용자 → "Google로 로그인" 클릭
2. Auth.js → Google OAuth 리다이렉트
3. 콜백 → Drizzle Adapter → Turso에 user/account/session 저장
4. 세션 쿠키 발급
5. middleware.ts → 보호 라우트 진입 시 세션 검증
6. 미인증 → / (랜딩) 리다이렉트
```

**보호 라우트**: `/dashboard`, `/signal`, `/stats`, `/community`, `/settings`, `/share`

---

## API 구조

```
POST   /api/nodes                노드 생성
PATCH  /api/nodes/[id]           목표(goal) 수정
PATCH  /api/nodes/[id]/achieve   달성 처리
DELETE /api/nodes/[id]           노드 삭제

POST   /api/pulses               Pulse 기록
PATCH  /api/pulses/[id]          Pulse 수정
DELETE /api/pulses/[id]          Pulse 삭제

GET    /api/graph                내 노드 + Pulse 집계 (시각화 단일 진입점)

POST   /api/proofs               Proof 공유
GET    /api/proofs               커뮤니티 피드 (커서 기반 페이지네이션)
POST   /api/proofs/[id]/react    반응 추가/토글
```

**공통 보안 원칙**:
- 모든 API: `auth()` 세션 검증 → `userId` 추출
- 모든 DB 쿼리: `WHERE user_id = session.user.id` 적용
- 타 유저 데이터 접근 불가 (서버에서 강제 격리)

---

## 환경변수

```bash
# Auth.js
AUTH_SECRET=<openssl rand -base64 32>
AUTH_GOOGLE_ID=<Google Cloud Console OAuth 2.0 Client ID>
AUTH_GOOGLE_SECRET=<Google Cloud Console OAuth 2.0 Client Secret>

# Turso
TURSO_DATABASE_URL=libsql://[db-name]-[org].turso.io
TURSO_AUTH_TOKEN=<Turso Dashboard → Database → Token>
```

- 로컬: `.env.local`
- 프로덕션: Vercel Dashboard → Settings → Environment Variables

---

## 배포 절차 (최초 1회)

```bash
# 1. Turso DB 생성
turso db create nurim

# 2. 스키마 적용
npx drizzle-kit push

# 3. Vercel 프로젝트 연결 (이미 .vercel/ 있음)
vercel env add AUTH_SECRET
vercel env add AUTH_GOOGLE_ID
# ... 나머지 env vars

# 4. 배포
git push origin main   # Vercel 자동 배포
```

---

## localStorage 처리

기존 `localStorage` 데이터(`nurim_nodes_v1`, `nurim_pulses_v1`)는 **버린다**.  
실제 사용자 데이터 없음, 개발 중 클린 스타트가 맞음.  
`lib/store.ts`는 DB 기반 API 호출로 전면 교체.
