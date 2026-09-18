import { UnauthorizedException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { Reflector } from '@nestjs/core';
import { TokenProvider } from '../../application/ports/token-provider.port.js';
import { AuthGuard } from './auth.guard.js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator.js';

function createContext(headers: Record<string, string> = {}, cookies: Record<string, string> = {}) {
  const request = { headers, cookies, user: undefined };
  return {
    request,
    switchToHttp: () => ({ getRequest: () => request }),
    getHandler: () => 'handler',
    getClass: () => 'class',
  };
}

function createSut(isPublic = false) {
  const reflector = {
    getAllAndOverride: vi.fn().mockReturnValue(isPublic),
  } as Reflector;
  const tokens: TokenProvider = {
    signAccess: vi.fn(), signRefresh: vi.fn(), refreshExpiresAt: vi.fn(), verifyRefresh: vi.fn(),
    verifyAccess: vi.fn().mockResolvedValue({ sub: 'user-1', scope: 'full', type: 'access' }),
  };
  return { guard: new AuthGuard(reflector, tokens), reflector, tokens };
}

describe('AuthGuard', () => {
  it('allows public routes without reading a token', async () => {
    const { guard, tokens } = createSut(true);
    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(tokens.verifyAccess).not.toHaveBeenCalled();
  });

  it('accepts a bearer token and attaches its payload to the request', async () => {
    const { guard, tokens } = createSut();
    const context = createContext({ authorization: 'Bearer access-token' });
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(tokens.verifyAccess).toHaveBeenCalledWith('access-token');
    expect(context.request.user).toMatchObject({ sub: 'user-1' });
  });

  it('uses the httpOnly access cookie when no bearer token is present', async () => {
    const { guard, tokens } = createSut();
    await guard.canActivate(createContext({}, { access_token: 'cookie-token' }));
    expect(tokens.verifyAccess).toHaveBeenCalledWith('cookie-token');
  });

  it('rejects absent and invalid access tokens', async () => {
    const { guard, tokens } = createSut();
    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(UnauthorizedException);
    vi.mocked(tokens.verifyAccess).mockRejectedValue(new Error('expired'));
    await expect(guard.canActivate(createContext({ authorization: 'Bearer expired-token' }))).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('keeps a bearer token as the preferred authentication mechanism', async () => {
    const { guard, tokens } = createSut();
    await guard.canActivate(createContext({ authorization: 'Bearer header-token' }, { access_token: 'cookie-token' }));
    expect(tokens.verifyAccess).toHaveBeenCalledWith('header-token');
    expect(IS_PUBLIC_KEY).toBe('isPublic');
  });
});
