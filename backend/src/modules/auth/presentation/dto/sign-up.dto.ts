import { createZodDto } from '../../../../common/validation/zod-dto.js';
import { z } from 'zod';

const signUpSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8)
    .max(72)
    .regex(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'errors.validation.passwordComplexity',
    ),
});

export class SignUpDto extends createZodDto(signUpSchema) {}
