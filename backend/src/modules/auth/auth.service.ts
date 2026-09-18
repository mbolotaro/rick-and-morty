import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { translate } from '../../common/i18n/translate.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  SignInInput,
  SignUpInput,
} from './presentation/schemas/auth.schemas.js';
import { TokenService } from './token.service.js';

type Session = { ip?: string; userAgent?: string };
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokenService,
  ) {}
  private publicUser(user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isEmailVerified: boolean;
  }) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };
  }
  private async issue(
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      isEmailVerified: boolean;
    },
    session: Session,
  ) {
    const refresh = await this.tokens.signRefresh(user.id);
    await this.prisma.refreshToken.create({
      data: {
        jti: refresh.jti,
        tokenHash: await bcrypt.hash(refresh.token, 12),
        userId: user.id,
        expiresAt: this.tokens.refreshExpirationDate(),
        ipAddress: session.ip,
        userAgent: session.userAgent,
      },
    });
    return {
      user: this.publicUser(user),
      accessToken: await this.tokens.signAccess(user.id, user.isEmailVerified),
      refreshToken: refresh.token,
    };
  }
  async signUp(dto: SignUpInput, session: Session) {
    const email = dto.email.trim().toLowerCase();
    if (await this.prisma.user.findUnique({ where: { email } }))
      throw new ConflictException(
        translate('errors.auth.emailAlreadyExists', 'E-mail já cadastrado.'),
      );
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
  async signIn(dto: SignInInput, session: Session) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    const valid = await bcrypt.compare(
      dto.password,
      user?.passwordHash ??
        '$2b$12$DzXeBdvtHyEMJQ76zwaJWeococKTIO3J4DF7ztsAlWzRY70/chUuG',
    );
    if (!user || !valid)
      throw new UnauthorizedException(
        translate(
          'errors.auth.invalidCredentials',
          'E-mail ou senha inválidos.',
        ),
      );
    return this.issue(user, session);
  }
  async refresh(raw: string, session: Session) {
    const payload = await this.tokens.verifyRefresh(raw);
    const record = await this.prisma.refreshToken.findUnique({
      where: { jti: payload.jti },
      include: { user: true },
    });
    if (
      !record ||
      record.expiresAt < new Date() ||
      !(await bcrypt.compare(raw, record.tokenHash))
    )
      throw new UnauthorizedException(
        translate(
          'errors.auth.invalidRefreshToken',
          'Refresh token inválido.',
        ),
      );
    if (record.revokedAt) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      throw new UnauthorizedException(
        translate(
          'errors.auth.compromisedSession',
          'Sessão comprometida.',
        ),
      );
    }
    const result = await this.issue(record.user, session);
    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: {
        revokedAt: new Date(),
        replacedBy: (await this.tokens.verifyRefresh(result.refreshToken)).jti,
      },
    });
    return result;
  }
  async signOut(raw?: string) {
    if (!raw) return;
    try {
      const { jti } = await this.tokens.verifyRefresh(raw);
      await this.prisma.refreshToken.updateMany({
        where: { jti, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    } catch {
      /* Always clear browser cookies. */
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

    if (!user)
      throw new UnauthorizedException(
        translate('errors.auth.userNotFound', 'Usuário não encontrado.'),
      );

    return user;
  }
  async revokeSession(userId: string, id: string) {
    const result = await this.prisma.refreshToken.updateMany({
      where: { id, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (!result.count)
      throw new UnauthorizedException(
        translate('errors.auth.sessionNotFound', 'Sessão não encontrada.'),
      );
  }
}
