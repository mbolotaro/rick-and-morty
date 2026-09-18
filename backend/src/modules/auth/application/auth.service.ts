import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { translate } from '../../../common/i18n/translate.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { SignInContract } from './contracts/sign-in.contract.js';
import type { SignUpContract } from './contracts/sign-up.contract.js';
import type { SessionInfoPayload } from '../domain/types/session-info.type.js';
import { AccessTokenScope } from '../domain/types/token-payload.type.js';
import { TokenProvider } from './ports/token-provider.port.js';
import { RefreshTokenService } from './refresh-token.service.js';

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokenProvider,
    private readonly refreshTokens: RefreshTokenService,
  ) {}

  private publicUser(user: User) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };
  }

  private scopeFor(user: User): AccessTokenScope {
    return user.isEmailVerified
      ? AccessTokenScope.Full
      : AccessTokenScope.Unverified;
  }

  private async issue(user: User, session: SessionInfoPayload) {
    const refresh = await this.refreshTokens.issue(user.id, session);

    return {
      user: this.publicUser(user),
      accessToken: await this.tokens.signAccess(user.id, this.scopeFor(user)),
      refreshToken: refresh.token,
    };
  }

  async signUp(dto: SignUpContract, session: SessionInfoPayload) {
    const email = dto.email.trim().toLowerCase();

    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new ConflictException(
        translate('errors.auth.emailAlreadyExists', 'E-mail já cadastrado.'),
      );
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        firstName: dto.firstName.trim(),
        lastName: dto.lastName.trim(),
        passwordHash: await bcrypt.hash(dto.password, 12),
      },
    });

    return this.issue(user, session);
  }

  async signIn(dto: SignInContract, session: SessionInfoPayload) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    const valid = await bcrypt.compare(
      dto.password,
      user?.passwordHash ??
        '$2b$12$DzXeBdvtHyEMJQ76zwaJWeococKTIO3J4DF7ztsAlWzRY70/chUuG',
    );

    if (!user || !valid) {
      throw new UnauthorizedException(
        translate(
          'errors.auth.invalidCredentials',
          'E-mail ou senha inválidos.',
        ),
      );
    }

    return this.issue(user, session);
  }

  async refresh(raw: string, session: SessionInfoPayload) {
    const rotated = await this.refreshTokens.rotate(raw, session);
    const user = await this.prisma.user.findUnique({
      where: { id: rotated.userId },
    });

    if (!user) {
      throw new UnauthorizedException(
        translate('errors.auth.userNotFound', 'Usuário não encontrado.'),
      );
    }

    return {
      user: this.publicUser(user),
      accessToken: await this.tokens.signAccess(user.id, this.scopeFor(user)),
      refreshToken: rotated.token,
    };
  }

  async signOut(raw?: string) {
    if (!raw) return;

    try {
      const { jti } = await this.tokens.verifyRefresh(raw);
      await this.refreshTokens.revoke(jti);
    } catch {
      // The browser cookies are cleared even if the token is invalid.
    }
  }

  async sessions(userId: string) {
    return this.prisma.refreshToken.findMany({
      where: { userId, revokedAt: null, expiresAt: { gt: new Date() } },
      select: {
        id: true,
        createdAt: true,
        expiresAt: true,
        ipAddress: true,
        userAgent: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async currentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        translate('errors.auth.userNotFound', 'Usuário não encontrado.'),
      );
    }

    return user;
  }

  async revokeSession(userId: string, id: string) {
    const result = await this.prisma.refreshToken.updateMany({
      where: { id, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    if (!result.count) {
      throw new UnauthorizedException(
        translate('errors.auth.sessionNotFound', 'Sessão não encontrada.'),
      );
    }
  }
}
