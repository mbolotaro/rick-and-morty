import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './application/auth.service.js';
import { PasswordHasher } from './application/ports/password-hasher.port.js';
import { RefreshTokenRepository } from './application/ports/refresh-token-repository.port.js';
import { TokenProvider } from './application/ports/token-provider.port.js';
import { UserRepository } from './application/ports/user-repository.port.js';
import { RefreshTokenService } from './application/refresh-token.service.js';
import { BcryptPasswordHasher } from './infrastructure/bcrypt-password-hasher.service.js';
import { JwtTokenProvider } from './infrastructure/jwt-token.provider.js';
import { PrismaRefreshTokenRepository } from './infrastructure/prisma-refresh-token.repository.js';
import { PrismaUserRepository } from './infrastructure/prisma-user.repository.js';
import { AuthController } from './presentation/auth.controller.js';
import { AuthCookieService } from './presentation/auth-cookie.service.js';
import { AuthGuard } from './presentation/guards/auth.guard.js';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthCookieService,
    { provide: TokenProvider, useClass: JwtTokenProvider },
    { provide: PasswordHasher, useClass: BcryptPasswordHasher },
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: RefreshTokenRepository, useClass: PrismaRefreshTokenRepository },
    RefreshTokenService,
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AuthModule {}
