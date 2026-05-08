import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n for auth callback and API routes
  const isAuthOrApi = pathname.startsWith('/auth') || pathname.startsWith('/api');

  // Run next-intl middleware for locale routing (unless auth/api)
  let response: NextResponse;
  if (isAuthOrApi) {
    response = NextResponse.next({ request });
  } else {
    response = intlMiddleware(request) as NextResponse;
  }

  // Refresh Supabase auth cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: We intentionally do NOT call supabase.auth.getUser() or
  // getSession() here. On slow networks (e.g. mobile in Tunisia), these
  // calls can hang and block ALL page loads. The client-side Supabase
  // client handles session refresh automatically.
  void supabase;

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
