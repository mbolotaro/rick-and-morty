import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateUserInput } from '../application/ports/user-repository.port.js';
import { UserRepository } from '../application/ports/user-repository.port.js';
import type { AuthUser } from '../domain/types/auth-user.type.js';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  findByEmail(email: string): Promise<AuthUser | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string): Promise<AuthUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(input: CreateUserInput): Promise<AuthUser> {
    return this.prisma.user.create({ data: input });
  }
}
