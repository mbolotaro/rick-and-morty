import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../application/ports/password-hasher.port.js';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class BcryptPasswordHasher extends PasswordHasher {
  hash(value: string): Promise<string> {
    return bcrypt.hash(value, BCRYPT_ROUNDS);
  }

  verify(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
