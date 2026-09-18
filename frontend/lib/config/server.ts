import 'server-only';

import { z } from 'zod';

const serverConfigSchema = z.object({
  BACKEND_URL: z.url().default('http://localhost:3040'),
});

export const serverConfig = serverConfigSchema.parse({
  BACKEND_URL: process.env.BACKEND_URL,
});
