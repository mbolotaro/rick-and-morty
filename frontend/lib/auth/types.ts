import { z } from 'zod';

export const authUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  isEmailVerified: z.boolean(),
});

export const authResponseSchema = z.object({
  user: authUserSchema,
});

export const signInInputSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const signUpInputSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email(),
  password: z.string().min(8).max(72),
});

export type AuthUser = z.infer<typeof authUserSchema>;
export type AuthResponse = z.infer<typeof authResponseSchema>;
export type SignInInput = z.infer<typeof signInInputSchema>;
export type SignUpInput = z.infer<typeof signUpInputSchema>;
