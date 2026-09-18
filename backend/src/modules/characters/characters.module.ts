import { Module } from '@nestjs/common';
import { EpisodesModule } from '../episodes/episodes.module.js';
import { LocationsModule } from '../locations/locations.module.js';
import { RickAndMortyModule } from '../rick-and-morty/rick-and-morty.module.js';
import { CharactersService } from './application/characters.service.js';
import { CharactersController } from './presentation/characters.controller.js';

@Module({
  imports: [RickAndMortyModule, EpisodesModule, LocationsModule],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService],
})
export class CharactersModule {}
