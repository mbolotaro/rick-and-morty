import 'server-only';

import { cookies } from 'next/headers';
import { authUserSchema, type AuthUser } from './types';
import { requestLanguage } from '../i18n/server';
import { ensureResponse, parseResponse, serverFetch } from '../http/server';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:3040';

export type SessionStatus = 'authenticated' | 'refreshable' | 'anonymous';

function backendCookies(access?: string, refresh?: string): string {
  return [
    access && `access_token=${access}`,
    refresh && `refresh_token=${refresh}`,
  ]
    .filter(Boolean)
    .join('; ');
}

export async function authRequest(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const store = await cookies();

  return serverFetch(`${backendUrl}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      cookie: backendCookies(
        store.get('access_token')?.value,
        store.get('refresh_token')?.value,
      ),
      'content-type': 'application/json',
      'accept-language': await requestLanguage(),
    },
    cache: 'no-store',
  });
}

export async function getSessionStatus(): Promise<SessionStatus> {
  const response = await authRequest('/auth/sessions');

  if (response.ok) return 'authenticated';

  const store = await cookies();
  const canRefresh = response.status === 401 && store.has('refresh_token');

  if (canRefresh) return 'refreshable';
  if (response.status === 401) return 'anonymous';

  await ensureResponse(response, 'request');
  return 'anonymous';
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const response = await authRequest('/auth/me');

  if (response.status === 401) return null;

  return parseResponse(response, authUserSchema, 'request');
}
