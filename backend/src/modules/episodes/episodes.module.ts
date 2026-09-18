import { Module } from '@nestjs/common';
import { RickAndMortyModule } from '../rick-and-morty/rick-and-morty.module.js';
import { CatalogEpisodesService } from './application/catalog-episodes.service.js';
import { CatalogEpisodesController } from './presentation/catalog-episodes.controller.js';

@Module({
  imports: [RickAndMortyModule],
  controllers: [CatalogEpisodesController],
  providers: [CatalogEpisodesService],
  exports: [CatalogEpisodesService],
})
export class EpisodesModule {}
