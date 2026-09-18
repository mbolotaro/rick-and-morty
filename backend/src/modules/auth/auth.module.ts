import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './application/auth.service.js';
import { TokenProvider } from './application/ports/token-provider.port.js';
import { RefreshTokenService } from './application/refresh-token.service.js';
import { JwtTokenProvider } from './infrastructure/jwt-token.provider.js';
import { AuthController } from './presentation/auth.controller.js';
import { AuthCookieService } from './presentation/auth-cookie.service.js';
import { AuthGuard } from './presentation/guards/auth.guard.js';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCookieService,
    { provide: TokenProvider, useClass: JwtTokenProvider },
    RefreshTokenService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
