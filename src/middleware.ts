import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail'

  const token = request.cookies.get('token')?.value || ''

  const response = NextResponse.next()

  // Set a cookie to indicate login status
  response.cookies.set('loggedIn', token ? 'true' : 'false', { path: '/' })

  if(isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  return response
}

 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/profile',
    '/login',
    '/signup',
    '/verifyemail'
  ]
}