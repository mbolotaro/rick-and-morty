import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { patchNestJsSwagger } from 'nestjs-zod';
import { AppModule } from './app.module.js';
import { EnvService } from './modules/env/env.service.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  patchNestJsSwagger();
  const env = app.get(EnvService);
  app.use(cookieParser());
  app.enableCors({
    origin: env.get('CORS_ORIGIN').split(','),
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('PickleVerso API')
    .setDescription(
      'API de autenticação, catálogo, favoritos e comentários do PickleVerso.',
    )
    .setVersion('1.0')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
    })
    .build();
  const swaggerDocument = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, swaggerDocument, {
    customSiteTitle: 'PickleVerso API',
    jsonDocumentUrl: 'docs-json',
  });

  await app.listen(env.get('PORT'));
}
await bootstrap();
