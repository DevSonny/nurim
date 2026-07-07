# 인프라 스택 교체 구현 플랜 (Plan 1/2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cloudflare + Oracle Cloud 스택을 Vercel + Turso + Auth.js v5로 교체하고, Google OAuth 로그인까지 동작하는 상태로 만든다.

**Architecture:** Next.js는 Vercel에 그대로 배포. DB는 Turso(libSQL)에 Drizzle ORM으로 연결. Auth.js v5 + Google OAuth + @auth/drizzle-adapter로 세션을 Turso에 저장. middleware.ts로 인증 라우트 보호.

**Tech Stack:** Next.js 15, Turso (@libsql/client), Drizzle ORM + drizzle-kit, Auth.js v5 (next-auth@beta), @auth/drizzle-adapter, Vercel

## Global Constraints

- 이모지 문자 UI에 절대 사용 금지 — 아이콘은 PNG 파일로
- `next.config.ts` 기존 `serverExternalPackages` 설정 유지 (three, r3f 등)
- `app/api/og/route.tsx` 건드리지 않음
- TypeScript strict 모드 유지
- 환경변수는 `.env.local` (로컬), Vercel Dashboard (프로덕션)

---

### Task 1: Cloudflare 의존성 제거

**Files:**
- Modify: `package.json`
- Delete: `wrangler.toml`
- Modify: `app/layout.tsx` (metadataBase URL 교체)

**Interfaces:**
- Produces: Cloudflare 패키지 없는 clean `package.json`

- [ ] **Step 1: Cloudflare 패키지 제거**

```bash
npm uninstall @cloudflare/next-on-pages wrangler
```

Expected output: `removed 2 packages`

- [ ] **Step 2: package.json scripts 정리**

`package.json`의 `scripts` 섹션에서 Cloudflare 관련 항목 제거:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

- [ ] **Step 3: wrangler.toml 삭제**

```bash
rm wrangler.toml
```

- [ ] **Step 4: metadataBase URL 교체**

`app/layout.tsx` 12번째 줄:

```typescript
metadataBase: new URL('https://nurim.vercel.app'),
```

> 실제 Vercel 도메인으로 나중에 업데이트. 지금은 placeholder로 충분.

- [ ] **Step 5: 빌드 확인**

```bash
npm run build
```

Expected: `Compiled successfully` (오류 없이 완료)

- [ ] **Step 6: 커밋**

```bash
git add -A && git commit -m "chore: remove Cloudflare dependencies and config"
```

---

### Task 2: Turso + Drizzle ORM 세팅

**Files:**
- Create: `lib/db/index.ts`
- Create: `lib/db/schema.ts`
- Create: `drizzle.config.ts`
- Modify: `package.json` (devDependencies)

**Interfaces:**
- Produces:
  - `db` — Drizzle 인스턴스 (`import { db } from '@/lib/db'`)
  - 스키마 전체 — `import { nodes, pulses, proofs, reactions } from '@/lib/db/schema'`

- [ ] **Step 1: 패키지 설치**

```bash
npm install @libsql/client drizzle-orm
npm install -D drizzle-kit
```

Expected: 오류 없이 설치 완료

- [ ] **Step 2: 환경변수 파일 생성**

`.env.local` 파일 생성:

```bash
TURSO_DATABASE_URL=libsql://[db-name]-[org].turso.io
TURSO_AUTH_TOKEN=your_token_here
```

> Turso 대시보드에서 실제 값 채워넣기: https://app.turso.tech

- [ ] **Step 3: Drizzle 클라이언트 생성**

`lib/db/index.ts`:

```typescript
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

export const db = drizzle(client, { schema })
```

- [ ] **Step 4: DB 스키마 정의**

`lib/db/schema.ts`:

```typescript
import {
  sqliteTable,
  text,
  integer,
  real,
  unique,
} from 'drizzle-orm/sqlite-core'

// ── Auth.js (Drizzle Adapter 표준) ────────────────────────────────────────────

export const users = sqliteTable('users', {
  id:            text('id').primaryKey(),
  name:          text('name'),
  email:         text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'timestamp_ms' }),
  image:         text('image'),
})

export const accounts = sqliteTable('accounts', {
  userId:            text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type:              text('type').notNull(),
  provider:          text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token:     text('refresh_token'),
  access_token:      text('access_token'),
  expires_at:        integer('expires_at'),
  token_type:        text('token_type'),
  scope:             text('scope'),
  id_token:          text('id_token'),
  session_state:     text('session_state'),
}, (t) => ({
  pk: unique().on(t.provider, t.providerAccountId),
}))

export const sessions = sqliteTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId:       text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires:      integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export const verificationTokens = sqliteTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token:      text('token').notNull(),
  expires:    integer('expires', { mode: 'timestamp_ms' }).notNull(),
}, (t) => ({
  pk: unique().on(t.identifier, t.token),
}))

// ── App Tables ────────────────────────────────────────────────────────────────

export const nodes = sqliteTable('nodes', {
  id:         text('id').primaryKey(),
  userId:     text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type:       text('type').notNull(),         // 'core' | 'orbit' | 'sub'
  label:      text('label').notNull(),
  orbitIdx:   integer('orbit_idx').notNull(), // 색상 일관성 유지용
  parentId:   text('parent_id'),              // nullable, self-ref
  goalType:   text('goal_type'),              // 'accumulation' | 'repetition'
  target:     real('target'),
  unit:       text('unit'),
  period:     text('period'),                 // 'day' | 'week' | 'month'
  achievedAt: integer('achieved_at'),         // unix ms, nullable
  createdAt:  integer('created_at').notNull(),
})

export const pulses = sqliteTable('pulses', {
  id:        text('id').primaryKey(),
  nodeId:    text('node_id').notNull().references(() => nodes.id, { onDelete: 'cascade' }),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date:      text('date').notNull(),   // YYYY-MM-DD
  value:     real('value').notNull(),  // 음수 허용 (money 지출)
  kind:      text('kind'),             // 'score'|'time'|'check'|'money'|'progress'
  memo:      text('memo'),
  createdAt: integer('created_at').notNull(),
})

export const proofs = sqliteTable('proofs', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  nodeId:    text('node_id').references(() => nodes.id, { onDelete: 'set null' }),
  body:      text('body').notNull(),
  createdAt: integer('created_at').notNull(),
})

export const reactions = sqliteTable('reactions', {
  id:           text('id').primaryKey(),
  proofId:      text('proof_id').notNull().references(() => proofs.id, { onDelete: 'cascade' }),
  userId:       text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reactionType: text('reaction_type').notNull(), // 'fire'|'flex'|'star'|'heart'|'check'
  createdAt:    integer('created_at').notNull(),
}, (t) => ({
  uniq: unique().on(t.proofId, t.userId, t.reactionType),
}))
```

- [ ] **Step 5: Drizzle Kit 설정**

`drizzle.config.ts`:

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config
```

- [ ] **Step 6: 스키마 Turso에 적용**

```bash
npx drizzle-kit push
```

Expected: `Changes applied` (테이블 생성 완료)

- [ ] **Step 7: TypeScript 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 오류 없음

- [ ] **Step 8: 커밋**

```bash
git add -A && git commit -m "feat: add Turso + Drizzle ORM schema and client"
```

---

### Task 3: Auth.js v5 + Google OAuth 설치

**Files:**
- Create: `lib/auth.ts`
- Create: `types/next-auth.d.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `middleware.ts`
- Modify: `components/auth/GoogleButton.tsx` (signIn 연결)
- Modify: `.env.local`

**Interfaces:**
- Consumes: `db` from `@/lib/db`, auth 테이블 4개 from `@/lib/db/schema`
- Produces:
  - `auth()` — 서버사이드 세션 조회 (`import { auth } from '@/lib/auth'`)
  - `signIn()`, `signOut()` — 클라이언트 액션
  - 보호 라우트: `/dashboard`, `/signal`, `/stats`, `/community`, `/settings`, `/share`

- [ ] **Step 1: Auth.js v5 설치**

```bash
npm install next-auth@beta @auth/drizzle-adapter
```

Expected: 오류 없이 설치

- [ ] **Step 2: 환경변수 추가**

`.env.local`에 추가:

```bash
AUTH_SECRET=<실행: openssl rand -base64 32 로 생성>
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
```

> Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID 생성.
> Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

- [ ] **Step 3: Auth 설정 파일 생성**

`lib/auth.ts`:

```typescript
import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id
      return session
    },
  },
})
```

- [ ] **Step 4: Auth.js 타입 확장**

`types/next-auth.d.ts`:

```typescript
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}
```

- [ ] **Step 5: API Route 핸들러 생성**

`app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

- [ ] **Step 6: middleware.ts 생성**

`middleware.ts` (프로젝트 루트):

```typescript
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const PROTECTED = ['/dashboard', '/signal', '/stats', '/community', '/settings', '/share']

export default auth((req) => {
  const isProtected = PROTECTED.some(path => req.nextUrl.pathname.startsWith(path))
  if (isProtected && !req.auth) {
    return NextResponse.redirect(new URL('/', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

- [ ] **Step 7: GoogleButton signIn 연결**

기존 `components/auth/GoogleButton.tsx`의 버튼 onClick에 signIn 연결:

```typescript
'use client'
import { signIn } from 'next-auth/react'

// 기존 버튼 스타일/레이아웃 그대로 유지하고 onClick만 교체:
onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
```

- [ ] **Step 8: 개발 서버에서 로그인 플로우 수동 확인**

```bash
npm run dev
```

체크리스트:
1. `http://localhost:3000` 접속
2. Google 로그인 버튼 클릭 → Google OAuth 동의 화면
3. 로그인 완료 → `/dashboard` 리다이렉트 확인
4. 로그아웃 후 `/dashboard` 직접 접근 → `/` 리다이렉트 확인
5. Turso 대시보드에서 `users`, `accounts`, `sessions` 테이블 레코드 생성 확인

- [ ] **Step 9: TypeScript 타입 체크**

```bash
npx tsc --noEmit
```

Expected: 오류 없음

- [ ] **Step 10: 커밋**

```bash
git add -A && git commit -m "feat: add Auth.js v5 with Google OAuth and route protection"
```

---

### Task 4: Vercel 배포

**Files:**
- No code changes — 환경변수 설정 및 배포만

- [ ] **Step 1: Vercel 환경변수 설정**

Vercel Dashboard → nurim 프로젝트 → Settings → Environment Variables에 추가:

```
AUTH_SECRET          = <Task 3에서 생성한 값>
AUTH_GOOGLE_ID       = <Google Console Client ID>
AUTH_GOOGLE_SECRET   = <Google Console Client Secret>
TURSO_DATABASE_URL   = libsql://[db-name]-[org].turso.io
TURSO_AUTH_TOKEN     = <Turso 토큰>
```

- [ ] **Step 2: Google OAuth Redirect URI 추가**

Google Cloud Console → OAuth 2.0 Client → Authorized redirect URIs에 추가:

```
https://nurim.vercel.app/api/auth/callback/google
```

- [ ] **Step 3: 배포**

```bash
git push origin main
```

Vercel이 자동으로 빌드/배포. Vercel Dashboard에서 배포 로그 확인.
Expected: `Build Completed` (오류 없음)

- [ ] **Step 4: 프로덕션 로그인 플로우 확인**

1. `https://nurim.vercel.app` 접속
2. Google 로그인 → `/dashboard` 리다이렉트 확인
3. 미인증 상태에서 `/dashboard` 직접 접근 → `/` 리다이렉트 확인

- [ ] **Step 5: metadataBase URL 실제 도메인으로 업데이트**

`app/layout.tsx`:

```typescript
metadataBase: new URL('https://nurim.vercel.app'),
```

- [ ] **Step 6: 최종 커밋 & 푸시**

```bash
git add app/layout.tsx
git commit -m "chore: update metadataBase to production Vercel URL"
git push origin main
```

---

## 완료 기준

- [ ] `npm run build` 오류 없음
- [ ] `npx tsc --noEmit` 오류 없음
- [ ] 로컬 Google 로그인 → `/dashboard` 리다이렉트 동작
- [ ] 미인증 상태 `/dashboard` 직접 접근 → `/` 리다이렉트 동작
- [ ] Turso `users` 테이블에 로그인한 사용자 레코드 확인
- [ ] Vercel 프로덕션에서 동일 플로우 동작

## 다음 단계

Plan 2/2: **데이터 레이어 교체** — `lib/store.ts` localStorage → DB API 연동
(`docs/superpowers/plans/2026-07-07-data-layer-migration.md`)
