import type {
  AccessTokenPayload,
  AccessTokenScope,
  RefreshTokenPayload,
} from '../../domain/types/token-payload.type.js';

export abstract class TokenProvider {
  abstract signAccess(sub: string, scope: AccessTokenScope): Promise<string>;
  abstract signRefresh(sub: string): Promise<{ jti: string; token: string }>;
  abstract refreshExpiresAt(): Date;
  abstract verifyAccess(token: string): Promise<AccessTokenPayload>;
  abstract verifyRefresh(token: string): Promise<RefreshTokenPayload>;
}
