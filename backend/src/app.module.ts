import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { fileURLToPath } from 'node:url';
import {
  AcceptLanguageResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { AppService } from './app.service.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { EnvModule } from './modules/env/env.module.js';
import { PrismaModule } from './modules/prisma/prisma.module.js';
import { RickAndMortyModule } from './modules/rick-and-morty/rick-and-morty.module.js';
import { CharactersModule } from './modules/characters/characters.module.js';
import { LocationsModule } from './modules/locations/locations.module.js';
import { EpisodesModule } from './modules/episodes/episodes.module.js';
import { FavoritesModule } from './modules/favorites/favorites.module.js';
import { CommentsModule } from './modules/comments/comments.module.js';
import { LocalizedExceptionFilter } from './common/filters/localized-exception.filter.js';

@Module({
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: LocalizedExceptionFilter,
    },
  ],
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'pt-BR',
      fallbacks: {
        pt: 'pt-BR',
        'pt-*': 'pt-BR',
        'en-*': 'en',
      },
      loaderOptions: {
        path: fileURLToPath(new URL('./i18n/', import.meta.url)),
        watch: true,
      },
      resolvers: [
        new QueryResolver(['lang']),
        new AcceptLanguageResolver({ matchType: 'strict-loose' }),
      ],
      logging: false,
    }),
    EnvModule,
    PrismaModule,
    AuthModule,
    RickAndMortyModule,
    CharactersModule,
    LocationsModule,
    EpisodesModule,
    FavoritesModule,
    CommentsModule,
  ],
})
export class AppModule {}
