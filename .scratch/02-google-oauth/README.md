# Google OAuth 인증 (Supabase Auth)

## What to build

Supabase Auth를 통한 Google OAuth 통합, 로그인/로그아웃 기능 구현, 사용자 세션 관리.

## Subtasks

### 1. Supabase Auth Google OAuth 설정

Supabase 대시보드에서 Google OAuth provider 설정, Google Cloud Console에서 OAuth 2.0 credentials 생성.

**Acceptance criteria:**
- [ ] Google Cloud Console 프로젝트 생성
- [ ] OAuth 2.0 Client ID/Secret 생성 (Authorized redirect URIs 설정)
- [ ] Supabase 대시보드 → Authentication → Providers → Google 설정
- [ ] Google OAuth credentials를 Supabase에 입력
- [ ] Redirect URL 확인 (Supabase 제공 URL)

**Blocked by:** 01-project-setup / Subtask 2

---

### 2. 로그인/로그아웃 페이지 구현

/app/login/page.tsx에 Google 로그인 버튼, 로그아웃 기능, 인증 상태 관리 hook 구현.

**Acceptance criteria:**
- [ ] 로그인 페이지에 'Google 로그인' 버튼 표시
- [ ] 버튼 클릭 시 Google OAuth 로그인 프롤로우
- [ ] 인증 성공 시 /app/dashboard로 자동 리디렉션
- [ ] 로그아웃 버튼 구현 (대시보드 또는 헤더)
- [ ] useAuth() hook 또는 context로 인증 상태 관리 (로그인 여부, 현재 사용자 정보)
- [ ] 보호된 페이지 (/dashboard) 미인증 시 /login으로 리디렉션

**Blocked by:**
- Subtask 1
- 01-project-setup / Subtask 3

---

## Overall Acceptance Criteria

- [ ] Google OAuth 로그인 성공
- [ ] 로그아웃 기능 동작
- [ ] 인증 상태 관리 hook 제공
- [ ] 보호된 페이지 리디렉션 동작
