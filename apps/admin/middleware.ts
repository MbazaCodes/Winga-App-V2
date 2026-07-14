import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/login']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r))

  // Check HttpOnly session cookie
  const session = req.cookies.get('winga_admin_session')?.value

  if (!isPublic && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isPublic && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo).*)'],
}
