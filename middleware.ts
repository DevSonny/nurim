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
