import type { AuthUser } from '../../domain/types/auth-user.type.js';

export interface CreateUserInput {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<AuthUser | null>;
  abstract findById(id: string): Promise<AuthUser | null>;
  abstract create(input: CreateUserInput): Promise<AuthUser>;
}
