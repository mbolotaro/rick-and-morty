import { z } from 'zod';

const password = z
  .string()
  .min(8)
  .max(72)
  .regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'errors.validation.passwordComplexity',
  );

export const SignUpSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email().trim().toLowerCase(),
  password,
});
export type SignUpInput = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
});
export type SignInInput = z.infer<typeof SignInSchema>;

export const MobileRefreshSchema = z.object({
  refreshToken: z.string().min(1),
});
export type MobileRefreshInput = z.infer<typeof MobileRefreshSchema>;
