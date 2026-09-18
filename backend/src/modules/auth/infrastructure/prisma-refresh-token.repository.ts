import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateRefreshTokenInput } from '../application/ports/refresh-token-repository.port.js';
import { RefreshTokenRepository } from '../application/ports/refresh-token-repository.port.js';
import type {
  RefreshTokenRecord,
  SessionRecord,
} from '../domain/types/refresh-token.type.js';

@Injectable()
export class PrismaRefreshTokenRepository extends RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: CreateRefreshTokenInput): Promise<void> {
    await this.prisma.refreshToken.create({ data: input });
  }

  findByJti(jti: string): Promise<RefreshTokenRecord | null> {
    return this.prisma.refreshToken.findUnique({ where: { jti } });
  }

  async revokeById(id: string, replacedBy?: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date(), ...(replacedBy ? { replacedBy } : {}) },
    });
  }

  async revokeByJti(jti: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { jti, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  findActiveByUser(userId: string): Promise<SessionRecord[]> {
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

  async revokeActiveSession(userId: string, id: string): Promise<boolean> {
    const result = await this.prisma.refreshToken.updateMany({
      where: { id, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return result.count > 0;
  }
}
