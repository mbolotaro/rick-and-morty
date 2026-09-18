import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module.js';
import { EnvService } from './modules/env/env.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = app.get(EnvService);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: env.get('CORS_ORIGIN').split(','),
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3040);
}
await bootstrap();
