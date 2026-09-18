import 'server-only';

import { cookies } from 'next/headers';
import { authRequest } from './server';
import {
  accessCookieOptions,
  extractAuthTokens,
  refreshCookieOptions,
} from './cookies';
import { ensureResponse, parseResponse } from '@/lib/http/server';
import {
  authResponseSchema,
  type AuthResponse,
  type SignInInput,
  type SignUpInput,
} from './types';

async function persistTokens(response: Response): Promise<void> {
  const tokens = extractAuthTokens(response);
  const store = await cookies();

  if (tokens.accessToken) {
    store.set('access_token', tokens.accessToken, accessCookieOptions);
  }

  if (tokens.refreshToken) {
    store.set('refresh_token', tokens.refreshToken, refreshCookieOptions);
  }
}

export async function signIn(payload: SignInInput): Promise<AuthResponse> {
  const response = await authRequest('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  await persistTokens(response);
  return parseResponse(response, authResponseSchema, 'signIn');
}

export async function signUp(payload: SignUpInput): Promise<AuthResponse> {
  const response = await authRequest('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  await persistTokens(response);
  return parseResponse(response, authResponseSchema, 'signUp');
}

export async function signOut(): Promise<void> {
  const response = await authRequest('/auth/sign-out', { method: 'POST' });
  await ensureResponse(response, 'signOut');

  const store = await cookies();
  store.delete('access_token');
  store.delete('refresh_token');
}
