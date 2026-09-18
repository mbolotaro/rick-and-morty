import { Module } from '@nestjs/common';
import { RickAndMortyModule } from '../rick-and-morty/rick-and-morty.module.js';
import { FavoritesService } from './application/favorites.service.js';
import { FavoritesRepository } from './application/ports/favorites-repository.port.js';
import { PrismaFavoritesRepository } from './infrastructure/prisma-favorites.repository.js';
import { FavoritesController } from './presentation/favorites.controller.js';

@Module({
  imports: [RickAndMortyModule],
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    { provide: FavoritesRepository, useClass: PrismaFavoritesRepository },
  ],
})
export class FavoritesModule {}
