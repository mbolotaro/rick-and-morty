import { describe, expect, it, vi } from 'vitest';
import { ApplicationError } from '../../../common/errors/application-error.js';
import { RefreshTokenService } from './refresh-token.service.js';
import { PasswordHasher } from './ports/password-hasher.port.js';
import { RefreshTokenRepository } from './ports/refresh-token-repository.port.js';
import { TokenProvider } from './ports/token-provider.port.js';
import type { RefreshTokenRecord } from '../domain/types/refresh-token.type.js';

const session = { ip: '127.0.0.1', userAgent: 'Vitest' };
const activeRecord: RefreshTokenRecord = {
  id: 'record-1',
  jti: 'jti-1',
  userId: 'user-1',
  tokenHash: 'token-hash',
  expiresAt: new Date(Date.now() + 60_000),
  revokedAt: null,
};

function createSut(record: RefreshTokenRecord | null = activeRecord) {
  const repository: RefreshTokenRepository = {
    create: vi.fn(),
    findByJti: vi.fn().mockResolvedValue(record),
    revokeById: vi.fn(),
    revokeByJti: vi.fn(),
    revokeAllForUser: vi.fn(),
    findActiveByUser: vi.fn(),
    revokeActiveSession: vi.fn(),
  };
  const passwords: PasswordHasher = {
    hash: vi.fn().mockResolvedValue('hashed-refresh-token'),
    verify: vi.fn().mockResolvedValue(true),
  };
  const tokens: TokenProvider = {
    signAccess: vi.fn(),
    signRefresh: vi.fn().mockResolvedValue({ token: 'new-token', jti: 'jti-2' }),
    refreshExpiresAt: vi.fn().mockReturnValue(new Date('2030-01-01T00:00:00.000Z')),
    verifyAccess: vi.fn(),
    verifyRefresh: vi.fn().mockResolvedValue({ sub: 'user-1', jti: 'jti-1' }),
  };
  return { service: new RefreshTokenService(repository, passwords, tokens), repository, passwords, tokens };
}

describe('RefreshTokenService', () => {
  it('persists only a hash when issuing a token', async () => {
    const { service, repository, passwords } = createSut();

    await expect(service.issue('user-1', session)).resolves.toEqual({ token: 'new-token', jti: 'jti-2' });
    expect(passwords.hash).toHaveBeenCalledWith('new-token');
    expect(repository.create).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user-1',
      jti: 'jti-2',
      tokenHash: 'hashed-refresh-token',
      ipAddress: session.ip,
      userAgent: session.userAgent,
    }));
  });

  it('rotates a valid active token and links the replacement', async () => {
    const { service, repository } = createSut();

    await expect(service.rotate('current-token', session)).resolves.toMatchObject({
      token: 'new-token', userId: 'user-1',
    });
    expect(repository.revokeById).toHaveBeenCalledWith('record-1', 'jti-2');
  });

  it.each([
    ['does not exist', null],
    ['is expired', { ...activeRecord, expiresAt: new Date(Date.now() - 1) }],
  ])('rejects a refresh token that %s', async (_label, record) => {
    const { service } = createSut(record);
    await expect(service.rotate('current-token', session)).rejects.toBeInstanceOf(ApplicationError);
  });

  it('revokes all active sessions when a revoked token is reused', async () => {
    const { service, repository } = createSut({ ...activeRecord, revokedAt: new Date() });

    await expect(service.rotate('reused-token', session)).rejects.toBeInstanceOf(ApplicationError);
    expect(repository.revokeAllForUser).toHaveBeenCalledWith('user-1');
  });
});
