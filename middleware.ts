import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(req: NextRequest) {
  // Check if the request is for an admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    // Get the session cookie
    const sessionCookie = req.cookies.get('sb-access-token')?.value

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      // Get user session
      const { data: { user }, error: sessionError } = await supabase.auth.getUser(sessionCookie)

      if (sessionError || !user) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profile || profile.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    } catch (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
} 