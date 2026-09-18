import 'server-only';

import { cookies } from 'next/headers';
import type { AuthResponse } from './types';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3001';

function backendCookies(access?: string, refresh?: string): string {
  return [
    access && `access_token=${access}`,
    refresh && `refresh_token=${refresh}`,
  ]
    .filter(Boolean)
    .join('; ');
}

function readCookie(setCookie: string, name: string): string | undefined {
  return new RegExp(`${name}=([^;]+)`).exec(setCookie)?.[1];
}

async function persistTokens(response: Response): Promise<void> {
  const setCookie = response.headers.get('set-cookie') ?? '';
  const accessToken = readCookie(setCookie, 'access_token');
  const refreshToken = readCookie(setCookie, 'refresh_token');
  const store = await cookies();

  if (accessToken) {
    store.set('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 15 * 60,
    });
  }

  if (refreshToken) {
    store.set('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });
  }
}

export async function authRequest(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const store = await cookies();
  return fetch(`${backendUrl}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      cookie: backendCookies(
        store.get('access_token')?.value,
        store.get('refresh_token')?.value,
      ),
      'content-type': 'application/json',
    },
    cache: 'no-store',
  });
}

export async function signIn(payload: Record<string, string>): Promise<AuthResponse> {
  const response = await authRequest('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('E-mail ou senha inválidos.');
  await persistTokens(response);
  return response.json();
}

export async function signUp(payload: Record<string, string>): Promise<AuthResponse> {
  const response = await authRequest('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('Não foi possível criar sua conta.');
  await persistTokens(response);
  return response.json();
}

export async function signOut(): Promise<void> {
  await authRequest('/auth/sign-out', { method: 'POST' });
  const store = await cookies();
  store.delete('access_token');
  store.delete('refresh_token');
}

export async function hasSession(): Promise<boolean> {
  let response = await authRequest('/auth/sessions');
  if (response.ok) return true;

  if (response.status !== 401) return false;
  response = await authRequest('/auth/refresh', { method: 'POST' });
  if (!response.ok) return false;
  await persistTokens(response);
  return (await authRequest('/auth/sessions')).ok;
}
