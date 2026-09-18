export enum AccessTokenScope {
  Unverified = 'unverified',
  Full = 'full',
}

export interface AccessTokenPayload {
  sub: string;
  scope: AccessTokenScope;
  type: 'access';
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
  type: 'refresh';
}
