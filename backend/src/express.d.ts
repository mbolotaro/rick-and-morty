import type { AccessTokenPayload } from './modules/auth/domain/types/token-payload.type.js';
declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}
export {};
