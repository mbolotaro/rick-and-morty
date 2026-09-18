import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from './env.schema.js';
import type { AppEnv } from './env.schema.js';
import { EnvService } from './env.service.js';

function validate(raw: Record<string, unknown>): AppEnv {
  const result = EnvSchema.safeParse(raw);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Variáveis de ambiente inválidas:\n${issues}`);
  }

  return result.data;
}

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validate })],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
