import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const role = request.cookies.get('role')?.value
    const { pathname } = request.nextUrl

    // Protected Routes
    const protectedRoutes = ['/admin']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
    const isAdminRoute = pathname.startsWith('/admin')

    // Auth Routes (redirect to home if already logged in)
    const authRoutes = ['/auth/login', '/auth/register']
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    // 1. Redirect to login if accessing protected route without token
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 2. Protect Admin Routes (Role Based)
    if (isAdminRoute && role !== 'ADMIN') {
        // If logged in but not admin, redirect to home
        return NextResponse.redirect(new URL('/', request.url))
    }

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
