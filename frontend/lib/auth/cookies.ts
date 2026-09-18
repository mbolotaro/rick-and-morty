export interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
}

export const accessCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 15 * 60,
} as const;

export const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 30 * 24 * 60 * 60,
} as const;

function readCookie(setCookie: string, name: string): string | undefined {
  return new RegExp(`${name}=([^;]+)`).exec(setCookie)?.[1];
}

export function extractAuthTokens(response: Response): AuthTokens {
  const setCookie = response.headers.get('set-cookie') ?? '';

  return {
    accessToken: readCookie(setCookie, 'access_token'),
    refreshToken: readCookie(setCookie, 'refresh_token'),
  };
}
