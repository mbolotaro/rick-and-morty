import { z } from 'zod';

type Duration = `${number}${'s' | 'm' | 'h' | 'd'}`;

const duration = (defaultValue: Duration) =>
  z
    .string()
    .regex(/^\d+[smhd]$/, 'Formato de duração inválido.')
    .default(defaultValue)
    .transform((value): Duration => value as Duration);

export const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_PORT: z.string().regex(/^\d+$/, 'DB_PORT deve ser numérico.'),
  DB_HOST: z.string().default('localhost'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres.'),
  JWT_ACCESS_EXPIRATION: duration('15m'),
  JWT_REFRESH_EXPIRATION: duration('30d'),
  CORS_ORIGIN: z.string().default('http://localhost:3001'),
});

export type AppEnv = z.infer<typeof EnvSchema>;
