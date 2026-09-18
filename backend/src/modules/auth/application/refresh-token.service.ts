import { Injectable } from '@nestjs/common';
import {
  ApplicationError,
  ApplicationErrorStatus,
} from '../../../common/errors/application-error.js';
import type { SessionInfoPayload } from '../domain/types/session-info.type.js';
import { PasswordHasher } from './ports/password-hasher.port.js';
import { RefreshTokenRepository } from './ports/refresh-token-repository.port.js';
import { TokenProvider } from './ports/token-provider.port.js';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly repository: RefreshTokenRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokens: TokenProvider,
  ) {}

  async issue(userId: string, session: SessionInfoPayload) {
    const issued = await this.tokens.signRefresh(userId);
    await this.repository.create({
      jti: issued.jti,
      userId,
      tokenHash: await this.passwordHasher.hash(issued.token),
      expiresAt: this.tokens.refreshExpiresAt(),
      ipAddress: session.ip,
      userAgent: session.userAgent,
    });
    return issued;
  }

  async rotate(rawToken: string, session: SessionInfoPayload) {
    const payload = await this.tokens.verifyRefresh(rawToken);
    const record = await this.repository.findByJti(payload.jti);
    if (
      !record ||
      record.expiresAt <= new Date() ||
      !(await this.passwordHasher.verify(rawToken, record.tokenHash))
    ) {
      throw new ApplicationError(
        ApplicationErrorStatus.Unauthorized,
        'errors.auth.invalidRefreshToken',
        'Invalid refresh token.',
      );
    }

    if (record.revokedAt) {
      await this.revokeAllForUser(record.userId);
      throw new ApplicationError(
        ApplicationErrorStatus.Unauthorized,
        'errors.auth.reusedRefreshToken',
        'Refresh token was reused.',
      );
    }

    const issued = await this.issue(record.userId, session);
    await this.repository.revokeById(record.id, issued.jti);
    return { ...issued, userId: record.userId };
  }

  revoke(jti: string): Promise<void> {
    return this.repository.revokeByJti(jti);
  }

  revokeAllForUser(userId: string): Promise<void> {
    return this.repository.revokeAllForUser(userId);
  }
}
