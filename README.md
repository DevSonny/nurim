# Nurim

Nurim is a goal-tracking web application built with a modern tech stack focused on performance and seamless data synchronization.

## Architecture

The application has been migrated from local storage to a fully synchronized cloud database architecture:
- **Framework**: Next.js (App Router, Route Handlers)
- **Database**: Turso (libSQL)
- **ORM**: Drizzle ORM
- **Data Fetching**: SWR for client-side data fetching and revalidation
- **Authentication**: Auth.js (NextAuth) with Google OAuth

## Local Development

To run the project locally, you must set up your environment variables.
Create a `.env.local` file in the root directory and add the following:

```env
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
TURSO_DATABASE_URL="libsql://[db-name]-[org].turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"
```

Then run the development server:
```bash
npm install
npm run dev
```

## Deployment (Vercel)

Before deploying to Vercel, the following environment variables must be configured in the Vercel Dashboard (Settings -> Environment Variables):

- `AUTH_SECRET`: Secret key for authentication
- `AUTH_GOOGLE_ID`: Google Console Client ID
- `AUTH_GOOGLE_SECRET`: Google Console Client Secret
- `TURSO_DATABASE_URL`: libsql://[db-name]-[org].turso.io
- `TURSO_AUTH_TOKEN`: Turso database auth token

Additionally, ensure that the OAuth 2.0 Client in Google Cloud Console has the following Authorized redirect URI:
`https://nurim.vercel.app/api/auth/callback/google`

After configuring these settings, pushes to the main branch will automatically trigger a build and deployment on Vercel.
