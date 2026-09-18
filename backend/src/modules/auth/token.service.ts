import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { translate } from '../../common/i18n/translate.js';
import { EnvService } from '../env/env.service.js';

export type AccessPayload = {
  sub: string;
  scope: 'full' | 'unverified';
  type: 'access';
};
export type RefreshPayload = { sub: string; jti: string; type: 'refresh' };

@Injectable()
export class TokenService {
  private readonly jwt: JwtService;
  private readonly accessExpires: string;
  private readonly refreshExpires: string;

  constructor(env: EnvService) {
    this.jwt = new JwtService({
      secret: env.get('JWT_SECRET'),
      signOptions: { algorithm: 'HS256' },
    });
    this.accessExpires = env.get('JWT_ACCESS_EXPIRATION');
    this.refreshExpires = env.get('JWT_REFRESH_EXPIRATION');
  }

  signAccess(userId: string, verified: boolean) {
    return this.jwt.signAsync(
      { sub: userId, scope: verified ? 'full' : 'unverified', type: 'access' },
      { expiresIn: this.accessExpires as any },
    );
  }

  async signRefresh(userId: string) {
    const jti = randomUUID();
    return {
      jti,
      token: await this.jwt.signAsync(
        { sub: userId, jti, type: 'refresh' },
        { expiresIn: this.refreshExpires as any },
      ),
    };
  }

  async verifyAccess(token: string): Promise<AccessPayload> {
    const payload = await this.jwt.verifyAsync<AccessPayload>(token);
    if (payload.type !== 'access')
      throw new UnauthorizedException(
        translate('errors.auth.invalidToken', 'Token inválido.'),
      );
    return payload;
  }

  async verifyRefresh(token: string): Promise<RefreshPayload> {
    const payload = await this.jwt.verifyAsync<RefreshPayload>(token);
    if (payload.type !== 'refresh')
      throw new UnauthorizedException(
        translate('errors.auth.invalidToken', 'Token inválido.'),
      );
    return payload;
  }

  refreshExpirationDate() {
    const value = this.refreshExpires;
    const match = /^(\d+)([smhd])$/.exec(value);
    const factor =
      match?.[2] === 's'
        ? 1000
        : match?.[2] === 'm'
          ? 60000
          : match?.[2] === 'h'
            ? 3600000
            : 86400000;
    return new Date(Date.now() + Number(match?.[1] ?? 30) * factor);
  }
}
