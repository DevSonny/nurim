# Nurim (누림)

Nurim은 성능과 매끄러운 데이터 동기화에 중점을 둔 모던 기술 스택으로 구축된 목표 추적 웹 애플리케이션입니다.

## 아키텍처 (Architecture)

애플리케이션의 핵심 데이터 레이어가 로컬 스토리지에서 클라우드 데이터베이스 아키텍처로 완전히 마이그레이션되었습니다:
- **Framework**: Next.js (App Router, Route Handlers)
- **Database**: Turso (libSQL)
- **ORM**: Drizzle ORM
- **Data Fetching**: SWR (클라이언트 사이드 데이터 패칭 및 재검증)
- **Authentication**: Auth.js (NextAuth) + Google OAuth

## 로컬 개발 환경 설정

프로젝트를 로컬에서 실행하려면 환경 변수를 설정해야 합니다.
루트 디렉토리에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
TURSO_DATABASE_URL="libsql://[db-name]-[org].turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"
```

그 후 개발 서버를 실행합니다:
```bash
npm install
npm run dev
```

## 배포 (Vercel)

Vercel에 배포하기 전에 Vercel 대시보드(Settings -> Environment Variables)에서 다음 환경 변수들을 구성해야 합니다:

- `AUTH_SECRET`: 인증용 시크릿 키
- `AUTH_GOOGLE_ID`: Google Console 클라이언트 ID
- `AUTH_GOOGLE_SECRET`: Google Console 클라이언트 시크릿
- `TURSO_DATABASE_URL`: libsql://[db-name]-[org].turso.io
- `TURSO_AUTH_TOKEN`: Turso 데이터베이스 인증 토큰

추가로, Google Cloud Console의 OAuth 2.0 클라이언트에 다음 승인된 리디렉션 URI가 설정되어 있는지 확인하세요:
`https://nurim.vercel.app/api/auth/callback/google`

이 설정들을 완료한 후 main 브랜치에 푸시하면 Vercel에서 자동으로 빌드 및 배포가 트리거됩니다.
