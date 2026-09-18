import { Injectable } from '@nestjs/common';
import {
  ApplicationError,
  ApplicationErrorStatus,
} from '../../../common/errors/application-error.js';
import type { SignInContract } from './contracts/sign-in.contract.js';
import type { SignUpContract } from './contracts/sign-up.contract.js';
import type { AuthUser, PublicAuthUser } from '../domain/types/auth-user.type.js';
import type { SessionInfoPayload } from '../domain/types/session-info.type.js';
import { AccessTokenScope } from '../domain/types/token-payload.type.js';
import { PasswordHasher } from './ports/password-hasher.port.js';
import { RefreshTokenRepository } from './ports/refresh-token-repository.port.js';
import { TokenProvider } from './ports/token-provider.port.js';
import { UserRepository } from './ports/user-repository.port.js';
import { RefreshTokenService } from './refresh-token.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokens: TokenProvider,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly refreshTokens: RefreshTokenService,
  ) {}

  async signUp(dto: SignUpContract, session: SessionInfoPayload) {
    const email = dto.email.trim().toLowerCase();
    if (await this.users.findByEmail(email)) {
      throw new ApplicationError(
        ApplicationErrorStatus.Conflict,
        'errors.auth.emailAlreadyExists',
        'Email already exists.',
      );
    }

    const user = await this.users.create({
      email,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      passwordHash: await this.passwordHasher.hash(dto.password),
    });
    return this.issue(user, session);
  }

  async signIn(dto: SignInContract, session: SessionInfoPayload) {
    const user = await this.users.findByEmail(dto.email.trim().toLowerCase());
    const valid = await this.passwordHasher.verify(
      dto.password,
      user?.passwordHash ??
        '$2b$12$DzXeBdvtHyEMJQ76zwaJWeococKTIO3J4DF7ztsAlWzRY70/chUuG',
    );

    if (!user || !valid) {
      throw new ApplicationError(
        ApplicationErrorStatus.Unauthorized,
        'errors.auth.invalidCredentials',
        'Invalid email or password.',
      );
    }
    return this.issue(user, session);
  }

  async refresh(raw: string, session: SessionInfoPayload) {
    const rotated = await this.refreshTokens.rotate(raw, session);
    const user = await this.users.findById(rotated.userId);
    if (!user) {
      throw new ApplicationError(
        ApplicationErrorStatus.Unauthorized,
        'errors.auth.userNotFound',
        'User not found.',
      );
    }

    return {
      user: this.publicUser(user),
      accessToken: await this.tokens.signAccess(user.id, this.scopeFor(user)),
      refreshToken: rotated.token,
    };
  }

  async signOut(raw?: string): Promise<void> {
    if (!raw) return;
    try {
      const { jti } = await this.tokens.verifyRefresh(raw);
      await this.refreshTokens.revoke(jti);
    } catch {
      // Cookie removal must remain idempotent when a token is invalid.
    }
  }

  sessions(userId: string) {
    return this.refreshTokenRepository.findActiveByUser(userId);
  }

  async currentUser(userId: string): Promise<PublicAuthUser> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new ApplicationError(
        ApplicationErrorStatus.Unauthorized,
        'errors.auth.userNotFound',
        'User not found.',
      );
    }
    return this.publicUser(user);
  }

  async revokeSession(userId: string, id: string): Promise<void> {
    if (!(await this.refreshTokenRepository.revokeActiveSession(userId, id))) {
      throw new ApplicationError(
        ApplicationErrorStatus.Unauthorized,
        'errors.auth.sessionNotFound',
        'Session not found.',
      );
    }
  }

  private publicUser(user: AuthUser): PublicAuthUser {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };
  }

  private scopeFor(user: AuthUser): AccessTokenScope {
    return user.isEmailVerified ? AccessTokenScope.Full : AccessTokenScope.Unverified;
  }

  private async issue(user: AuthUser, session: SessionInfoPayload) {
    const refresh = await this.refreshTokens.issue(user.id, session);
    return {
      user: this.publicUser(user),
      accessToken: await this.tokens.signAccess(user.id, this.scopeFor(user)),
      refreshToken: refresh.token,
    };
  }
}
