import { type NextRequest, NextResponse } from 'next/server';
import {
  accessCookieOptions,
  extractAuthTokens,
  refreshCookieOptions,
} from '@/lib/auth/cookies';
import { authRequest } from '@/lib/auth/server';

function safeReturnPath(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard';
  }

  return value;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const returnTo = safeReturnPath(request.nextUrl.searchParams.get('returnTo'));
  let refreshResponse: Response;

  try {
    refreshResponse = await authRequest('/auth/refresh', { method: 'POST' });
  } catch {
    return NextResponse.redirect(new URL('/login?error=refresh', request.url));
  }
  const tokens = extractAuthTokens(refreshResponse);

  if (!refreshResponse.ok || !tokens.accessToken) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  const response = NextResponse.redirect(new URL(returnTo, request.url));
  response.cookies.set('access_token', tokens.accessToken, accessCookieOptions);

  if (tokens.refreshToken) {
    response.cookies.set('refresh_token', tokens.refreshToken, refreshCookieOptions);
  }

  return response;
}
