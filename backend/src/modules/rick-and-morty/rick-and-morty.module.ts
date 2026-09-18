import { Module } from '@nestjs/common';
import { CatalogLocalizerService } from './application/catalog-localizer.service.js';
import { RickAndMortyApiClient } from './infrastructure/rick-and-morty-api.client.js';

@Module({
  providers: [RickAndMortyApiClient, CatalogLocalizerService],
  exports: [RickAndMortyApiClient, CatalogLocalizerService],
})
export class RickAndMortyModule {}
