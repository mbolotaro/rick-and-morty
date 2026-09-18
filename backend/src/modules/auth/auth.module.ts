import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller.js';
import { AuthCookieService } from './auth-cookie.service.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { RefreshTokenService } from './tokens/refresh-token.service.js';
import { TokenService } from './tokens/token.service.js';
import { TokenService as LegacyTokenService } from './token.service.js';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCookieService,
    TokenService,
    LegacyTokenService,
    RefreshTokenService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
