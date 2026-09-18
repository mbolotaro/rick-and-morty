import { describe, expect, it, vi } from 'vitest';
import { ApplicationError } from '../../../common/errors/application-error.js';
import { AuthService } from './auth.service.js';
import { PasswordHasher } from './ports/password-hasher.port.js';
import { RefreshTokenRepository } from './ports/refresh-token-repository.port.js';
import { TokenProvider } from './ports/token-provider.port.js';
import { UserRepository } from './ports/user-repository.port.js';
import { RefreshTokenService } from './refresh-token.service.js';
import type { AuthUser } from '../domain/types/auth-user.type.js';
import type { SessionInfoPayload } from '../domain/types/session-info.type.js';

const user: AuthUser = {
  id: 'user-1',
  firstName: 'Rick',
  lastName: 'Sanchez',
  email: 'rick@example.com',
  passwordHash: 'hashed-password',
  isEmailVerified: true,
};

const session: SessionInfoPayload = { ip: '127.0.0.1', userAgent: 'Vitest' };

function createSut(overrides: Partial<AuthUser> = {}) {
  const currentUser = { ...user, ...overrides };
  const users: UserRepository = {
    findByEmail: vi.fn().mockResolvedValue(null),
    findById: vi.fn().mockResolvedValue(currentUser),
    create: vi.fn().mockResolvedValue(currentUser),
  };
  const passwords: PasswordHasher = {
    hash: vi.fn().mockResolvedValue('hashed-password'),
    verify: vi.fn().mockResolvedValue(true),
  };
  const tokens: TokenProvider = {
    signAccess: vi.fn().mockResolvedValue('access-token'),
    signRefresh: vi.fn(),
    refreshExpiresAt: vi.fn(),
    verifyAccess: vi.fn(),
    verifyRefresh: vi.fn(),
  };
  const sessions: RefreshTokenRepository = {
    create: vi.fn(),
    findByJti: vi.fn(),
    revokeById: vi.fn(),
    revokeByJti: vi.fn(),
    revokeAllForUser: vi.fn(),
    findActiveByUser: vi.fn().mockResolvedValue([]),
    revokeActiveSession: vi.fn().mockResolvedValue(true),
  };
  const refreshTokens = new RefreshTokenService(sessions, passwords, tokens);
  vi.spyOn(refreshTokens, 'issue').mockResolvedValue({
    token: 'refresh-token',
    jti: 'jti-1',
  });
  vi.spyOn(refreshTokens, 'rotate').mockResolvedValue({
      token: 'rotated-refresh-token',
      jti: 'jti-2',
      userId: currentUser.id,
  });
  vi.spyOn(refreshTokens, 'revoke').mockResolvedValue();

  return {
    service: new AuthService(users, passwords, tokens, sessions, refreshTokens),
    users,
    passwords,
    tokens,
    sessions,
    refreshTokens,
  };
}

describe('AuthService', () => {
  it('normalizes input, creates the user and issues a session on sign-up', async () => {
    const { service, users, passwords, tokens, refreshTokens } = createSut();

    const result = await service.signUp(
      {
        firstName: ' Rick ',
        lastName: ' Sanchez ',
        email: ' RICK@EXAMPLE.COM ',
        password: 'password-123',
      },
      session,
    );

    expect(users.findByEmail).toHaveBeenCalledWith('rick@example.com');
    expect(passwords.hash).toHaveBeenCalledWith('password-123');
    expect(users.create).toHaveBeenCalledWith({
      firstName: 'Rick',
      lastName: 'Sanchez',
      email: 'rick@example.com',
      passwordHash: 'hashed-password',
    });
    expect(refreshTokens.issue).toHaveBeenCalledWith(user.id, session);
    expect(tokens.signAccess).toHaveBeenCalledWith(user.id, 'full');
    expect(result).toMatchObject({ accessToken: 'access-token', refreshToken: 'refresh-token' });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects sign-up when the email is already registered', async () => {
    const { service, users } = createSut();
    vi.mocked(users.findByEmail).mockResolvedValue(user);

    await expect(
      service.signUp({ firstName: 'Rick', lastName: 'Sanchez', email: user.email, password: 'password-123' }, session),
    ).rejects.toBeInstanceOf(ApplicationError);
    expect(users.create).not.toHaveBeenCalled();
  });

  it('issues tokens for valid credentials', async () => {
    const { service, users, passwords } = createSut();
    vi.mocked(users.findByEmail).mockResolvedValue(user);

    await expect(service.signIn({ email: user.email, password: 'password-123' }, session)).resolves.toMatchObject({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(passwords.verify).toHaveBeenCalledWith('password-123', user.passwordHash);
  });

  it('does not disclose whether an invalid account exists', async () => {
    const { service, passwords } = createSut();
    vi.mocked(passwords.verify).mockResolvedValue(false);

    await expect(service.signIn({ email: user.email, password: 'wrong-password' }, session)).rejects.toBeInstanceOf(ApplicationError);
    expect(passwords.verify).toHaveBeenCalledOnce();
  });

  it('uses the unverified scope for an unverified user', async () => {
    const { service, tokens } = createSut({ isEmailVerified: false });

    await service.signUp({ firstName: 'Rick', lastName: 'Sanchez', email: user.email, password: 'password-123' }, session);

    expect(tokens.signAccess).toHaveBeenCalledWith(user.id, 'unverified');
  });

  it('rotates a refresh token and returns the matching user', async () => {
    const { service, refreshTokens, tokens } = createSut();

    const result = await service.refresh('refresh-token', session);

    expect(refreshTokens.rotate).toHaveBeenCalledWith('refresh-token', session);
    expect(tokens.signAccess).toHaveBeenCalledWith(user.id, 'full');
    expect(result.refreshToken).toBe('rotated-refresh-token');
  });

  it('rejects a rotated token whose user was deleted', async () => {
    const { service, users } = createSut();
    vi.mocked(users.findById).mockResolvedValue(null);

    await expect(service.refresh('refresh-token', session)).rejects.toBeInstanceOf(ApplicationError);
  });

  it('makes sign-out idempotent for invalid tokens', async () => {
    const { service, tokens, refreshTokens } = createSut();
    vi.mocked(tokens.verifyRefresh).mockRejectedValue(new Error('invalid'));

    await expect(service.signOut('invalid-token')).resolves.toBeUndefined();
    expect(refreshTokens.revoke).not.toHaveBeenCalled();
  });

  it('lists and revokes only a user session', async () => {
    const { service, sessions } = createSut();

    await service.sessions(user.id);
    await service.revokeSession(user.id, 'session-1');

    expect(sessions.findActiveByUser).toHaveBeenCalledWith(user.id);
    expect(sessions.revokeActiveSession).toHaveBeenCalledWith(user.id, 'session-1');
  });

  it('rejects revoking a session that is not active for the user', async () => {
    const { service, sessions } = createSut();
    vi.mocked(sessions.revokeActiveSession).mockResolvedValue(false);

    await expect(service.revokeSession(user.id, 'missing')).rejects.toBeInstanceOf(ApplicationError);
  });
});
