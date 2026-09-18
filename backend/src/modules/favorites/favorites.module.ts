import { Module } from '@nestjs/common';
import { CharactersModule } from '../characters/characters.module.js';
import { EpisodesModule } from '../episodes/episodes.module.js';
import { LocationsModule } from '../locations/locations.module.js';
import { FavoritesService } from './application/favorites.service.js';
import { FavoritesController } from './presentation/favorites.controller.js';

@Module({
  imports: [CharactersModule, LocationsModule, EpisodesModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
