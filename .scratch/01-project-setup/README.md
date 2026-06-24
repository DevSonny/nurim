# 프로젝트 초기 설정 (Next.js + Supabase + Vercel)

## What to build

Next.js 프로젝트 생성, Supabase 데이터베이스 + 인증 연결, Vercel 배포 환경 구성.

## Subtasks

### 1. Next.js 프로젝트 생성 및 기본 구조

Next.js 14+ 프로젝트 생성, TypeScript 설정, 기본 페이지 구조 (홈, 로그인, 대시보드 경로) 설정.

**Acceptance criteria:**
- [ ] Next.js 프로젝트 생성 (npx create-next-app)
- [ ] TypeScript 설정 완료
- [ ] 페이지 구조: /app/page.tsx (홈), /app/login/page.tsx (로그인), /app/dashboard/page.tsx (대시보드)
- [ ] 기본 레이아웃 (헤더, 사이드바 구조) 생성
- [ ] 개발 서버 실행 확인 (npm run dev)

**Blocked by:** None

---

### 2. Supabase 연결 및 RLS 정책 설정

Supabase 프로젝트 생성, PostgreSQL 데이터베이스 연결, 사용자별 RLS(Row-Level Security) 정책 설정.

**Acceptance criteria:**
- [ ] Supabase 프로젝트 생성 및 프로젝트 URL/Key 획득
- [ ] Supabase 클라이언트 라이브러리 설치 (npm install @supabase/supabase-js)
- [ ] RLS 정책 활성화 (모든 테이블에 기본 정책 적용)
- [ ] 사용자별 데이터 격리 정책 설정 예시 (Core 테이블 기준)
- [ ] Supabase 클라이언트 초기화 파일 생성

**Blocked by:** None

---

### 3. 환경 변수 설정 및 Vercel 배포 준비

.env.local 환경 변수 설정, Vercel 배포 설정, 기본 CI/CD 파이프라인 준비.

**Acceptance criteria:**
- [ ] .env.local 생성 (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [ ] .gitignore에 .env.local 추가
- [ ] Vercel 프로젝트 연결 (vercel.json 또는 Vercel 대시보드)
- [ ] 환경 변수를 Vercel에 추가
- [ ] 로컬 개발 환경에서 Supabase 연결 테스트

**Blocked by:**
- Subtask 1
- Subtask 2

---

## Overall Acceptance Criteria

- [ ] 개발 서버 정상 실행
- [ ] Supabase 연결 확인
- [ ] 환경 변수 설정 완료
- [ ] GitHub 초기 commit 완료
