import { Module } from '@nestjs/common';
import { CatalogLocalizerService } from './application/catalog-localizer.service.js';
import { CatalogGateway } from './application/ports/catalog-gateway.port.js';
import { RickAndMortyApiClient } from './infrastructure/rick-and-morty-api.client.js';

@Module({
  providers: [
    CatalogLocalizerService,
    { provide: CatalogGateway, useClass: RickAndMortyApiClient },
  ],
  exports: [CatalogGateway, CatalogLocalizerService],
})
export class RickAndMortyModule {}
