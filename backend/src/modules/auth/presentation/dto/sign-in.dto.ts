import { createZodDto } from '../../../../common/validation/zod-dto.js';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
});

export class SignInDto extends createZodDto(signInSchema) {}
