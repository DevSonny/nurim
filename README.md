# Nurim

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
