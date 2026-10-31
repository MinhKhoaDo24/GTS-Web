import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Bảo vệ tất cả route /admin trừ /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token =
      request.cookies.get('authjs.session-token') ||
      request.cookies.get('__Secure-authjs.session-token') ||
      request.cookies.get('next-auth.session-token') ||
      request.cookies.get('__Secure-next-auth.session-token')

    if (!token) {
      // Xác định base URL từ header proxy thực tế để không bao giờ bị dính 0.0.0.0
      const forwardHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
      const forwardProto = request.headers.get('x-forwarded-proto') || 'https'
      
      let baseUrl: string
      if (forwardHost && !forwardHost.includes('0.0.0.0')) {
        baseUrl = `${forwardProto}://${forwardHost}`
      } else {
        baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://gts.net.vn'
      }

      const loginUrl = new URL('/admin/login', baseUrl)
      // callbackUrl chỉ lưu path nội bộ (ví dụ /admin)
      const returnTo = pathname + (request.nextUrl.search || '')
      loginUrl.searchParams.set('callbackUrl', returnTo)

      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
