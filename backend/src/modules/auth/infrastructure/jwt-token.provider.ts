import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { translate } from '../../../common/i18n/translate.js';
import { EnvService } from '../../env/env.service.js';
import { TokenProvider } from '../application/ports/token-provider.port.js';
import {
  AccessTokenPayload,
  AccessTokenScope,
  RefreshTokenPayload,
} from '../domain/types/token-payload.type.js';

@Injectable()
export class JwtTokenProvider extends TokenProvider {
  private readonly jwt: JwtService;

  constructor(private readonly env: EnvService) {
    super();
    this.jwt = new JwtService({ secret: env.get('JWT_SECRET') });
  }

  signAccess(sub: string, scope: AccessTokenScope): Promise<string> {
    const payload: AccessTokenPayload = { sub, scope, type: 'access' };

    return this.jwt.signAsync(payload, {
      expiresIn: this.env.get('JWT_ACCESS_EXPIRATION'),
    });
  }

  async signRefresh(sub: string): Promise<{ jti: string; token: string }> {
    const jti = randomUUID();
    const payload: RefreshTokenPayload = { sub, jti, type: 'refresh' };

    return {
      jti,
      token: await this.jwt.signAsync(payload, {
        expiresIn: this.env.get('JWT_REFRESH_EXPIRATION'),
      }),
    };
  }

  refreshExpiresAt(): Date {
    const duration = this.env.get('JWT_REFRESH_EXPIRATION');
    const match = /^(\d+)([smhd])$/.exec(duration);
    const unit = match?.[2];
    const multiplier =
      unit === 's'
        ? 1_000
        : unit === 'm'
          ? 60_000
          : unit === 'h'
            ? 3_600_000
            : 86_400_000;

    return new Date(Date.now() + Number(match?.[1] ?? 0) * multiplier);
  }

  async verifyAccess(token: string): Promise<AccessTokenPayload> {
    const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token);

    if (payload.type !== 'access') {
      throw new UnauthorizedException(
        translate('errors.auth.invalidToken', 'Token inválido.'),
      );
    }

    return payload;
  }

  async verifyRefresh(token: string): Promise<RefreshTokenPayload> {
    const payload = await this.jwt.verifyAsync<RefreshTokenPayload>(token);

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException(
        translate('errors.auth.invalidToken', 'Token inválido.'),
      );
    }

    return payload;
  }
}
