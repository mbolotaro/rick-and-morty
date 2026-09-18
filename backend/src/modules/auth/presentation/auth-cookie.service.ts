import { Injectable } from '@nestjs/common';
import type { CookieOptions, Request, Response } from 'express';
import { EnvService } from '../../env/env.service.js';

@Injectable()
export class AuthCookieService {
  static readonly ACCESS_TOKEN = 'access_token';
  static readonly REFRESH_TOKEN = 'refresh_token';

  constructor(private readonly env: EnvService) {}

  get(request: Request): { accessToken?: string; refreshToken?: string } {
    return {
      accessToken: request.cookies?.[AuthCookieService.ACCESS_TOKEN],
      refreshToken: request.cookies?.[AuthCookieService.REFRESH_TOKEN],
    };
  }

  set(
    response: Response,
    tokens: { accessToken: string; refreshToken: string },
  ): void {
    const base = this.options();
    response.cookie(AuthCookieService.ACCESS_TOKEN, tokens.accessToken, {
      ...base,
      path: '/',
      maxAge: this.duration('JWT_ACCESS_EXPIRATION'),
    });
    response.cookie(AuthCookieService.REFRESH_TOKEN, tokens.refreshToken, {
      ...base,
      path: '/auth',
      maxAge: this.duration('JWT_REFRESH_EXPIRATION'),
    });
  }

  clear(response: Response): void {
    const base = this.options();
    response.clearCookie(AuthCookieService.ACCESS_TOKEN, { ...base, path: '/' });
    response.clearCookie(AuthCookieService.REFRESH_TOKEN, {
      ...base,
      path: '/auth',
    });
  }

  private options(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.env.get('NODE_ENV') === 'production',
      sameSite: 'lax',
    };
  }

  private duration(
    key: 'JWT_ACCESS_EXPIRATION' | 'JWT_REFRESH_EXPIRATION',
  ): number {
    const match = /^(\d+)([smhd])$/.exec(this.env.get(key));
    const unit = match?.[2];

    return (
      Number(match?.[1] ?? 0) *
      (unit === 's'
        ? 1_000
        : unit === 'm'
          ? 60_000
          : unit === 'h'
            ? 3_600_000
            : 86_400_000)
    );
  }
}
