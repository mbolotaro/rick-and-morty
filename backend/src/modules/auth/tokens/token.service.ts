import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { translate } from '../../../common/i18n/translate.js';
import { EnvService } from '../../env/env.service.js';
import {
  AccessTokenPayload,
  AccessTokenScope,
  RefreshTokenPayload,
} from './types/access-token.type.js';

@Injectable()
export class TokenService {
  private readonly jwt: JwtService;

  constructor(private readonly env: EnvService) {
    this.jwt = new JwtService({ secret: env.get('JWT_SECRET') });
  }

  signAccess(sub: string, scope: AccessTokenScope): Promise<string> {
    const payload: AccessTokenPayload = { sub, scope, type: 'access' };
    return this.jwt.signAsync(payload, {
      expiresIn: this.env.get('JWT_ACCESS_EXPIRATION') as any,
    });
  }

  async signRefresh(sub: string): Promise<{ jti: string; token: string }> {
    const jti = randomUUID();
    const payload: RefreshTokenPayload = { sub, jti, type: 'refresh' };
    return {
      jti,
      token: await this.jwt.signAsync(payload, {
        expiresIn: this.env.get('JWT_REFRESH_EXPIRATION') as any,
      }),
    };
  }

  async verifyAccess(token: string): Promise<AccessTokenPayload> {
    const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token);
    if (payload.type !== 'access')
      throw new UnauthorizedException(
        translate('errors.auth.invalidToken', 'Token inválido.'),
      );
    return payload;
  }

  async verifyRefresh(token: string): Promise<RefreshTokenPayload> {
    const payload = await this.jwt.verifyAsync<RefreshTokenPayload>(token);
    if (payload.type !== 'refresh')
      throw new UnauthorizedException(
        translate('errors.auth.invalidToken', 'Token inválido.'),
      );
    return payload;
  }
}
