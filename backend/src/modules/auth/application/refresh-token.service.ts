import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { translate } from '../../../common/i18n/translate.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { SessionInfoPayload } from '../domain/types/session-info.type.js';
import { TokenProvider } from './ports/token-provider.port.js';
import { EnvService } from '../../env/env.service.js';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokenProvider,
    private readonly env: EnvService,
  ) {}

  private expiresAt(): Date {
    const match = /^(\d+)([smhd])$/.exec(
      this.env.get('JWT_REFRESH_EXPIRATION'),
    );
    const unit = match?.[2];
    const multiplier =
      unit === 's'
        ? 1_000
        : unit === 'm'
          ? 60_000
          : unit === 'h'
            ? 3_600_000
            : 86_400_000;

    return new Date(Date.now() + Number(match?.[1] ?? 30) * multiplier);
  }

  async issue(userId: string, session: SessionInfoPayload) {
    const issued = await this.tokens.signRefresh(userId);

    await this.prisma.refreshToken.create({
      data: {
        jti: issued.jti,
        userId,
        tokenHash: await bcrypt.hash(issued.token, 12),
        expiresAt: this.expiresAt(),
        ipAddress: session.ip,
        userAgent: session.userAgent,
      },
    });

    return issued;
  }

  async rotate(rawToken: string, session: SessionInfoPayload) {
    const payload = await this.tokens.verifyRefresh(rawToken);
    const record = await this.prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
    });

    if (
      !record ||
      record.expiresAt <= new Date() ||
      !(await bcrypt.compare(rawToken, record.tokenHash))
    ) {
      throw new UnauthorizedException(
        translate(
          'errors.auth.invalidRefreshToken',
          'Refresh token inválido.',
        ),
      );
    }

    if (record.revokedAt) {
      await this.revokeAllForUser(record.userId);
      throw new UnauthorizedException(
        translate(
          'errors.auth.reusedRefreshToken',
          'Refresh token reutilizado.',
        ),
      );
    }

    const issued = await this.issue(record.userId, session);
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date(), replacedBy: issued.jti },
    });

    return { ...issued, userId: record.userId };
  }

  async revoke(jti: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { jti, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
