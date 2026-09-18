import { z } from 'zod';

type Duration = `${number}${'s' | 'm' | 'h' | 'd'}`;

const duration = (defaultValue: Duration) =>
  z
    .string()
    .regex(/^\d+[smhd]$/, 'Formato de duração inválido.')
    .default(defaultValue)
    .transform((value): Duration => value as Duration);

export const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3040),
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
  RICK_AND_MORTY_API_URL: z.url().default('https://rickandmortyapi.com/api'),
});

export type AppEnv = z.infer<typeof EnvSchema>;
