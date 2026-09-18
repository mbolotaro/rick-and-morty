import type {
  RefreshTokenRecord,
  SessionRecord,
} from '../../domain/types/refresh-token.type.js';

export interface CreateRefreshTokenInput {
  jti: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export abstract class RefreshTokenRepository {
  abstract create(input: CreateRefreshTokenInput): Promise<void>;
  abstract findByJti(jti: string): Promise<RefreshTokenRecord | null>;
  abstract revokeById(id: string, replacedBy?: string): Promise<void>;
  abstract revokeByJti(jti: string): Promise<void>;
  abstract revokeAllForUser(userId: string): Promise<void>;
  abstract findActiveByUser(userId: string): Promise<SessionRecord[]>;
  abstract revokeActiveSession(userId: string, id: string): Promise<boolean>;
}
