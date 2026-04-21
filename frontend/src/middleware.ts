import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const role = request.cookies.get('role')?.value
    const { pathname } = request.nextUrl

    // Protected Routes
    const isProtectedRoute = pathname.startsWith('/admin')
    const isAdminRoute = pathname.startsWith('/admin')

    // Auth Routes (redirect to home if already logged in)
    const isAuthRoute = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')

    // 1. Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 2. Protect Admin Routes (Role Based)
    if (isAdminRoute && token && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // 3. Redirect logged-in users away from auth pages
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/checkout/:path*',
        '/auth/:path*'
    ],
}
