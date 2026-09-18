export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  isEmailVerified: boolean;
}

export interface PublicAuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
}
