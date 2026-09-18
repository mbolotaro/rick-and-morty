export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  user: AuthUser;
}
