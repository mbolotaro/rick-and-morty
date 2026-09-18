import { Injectable } from '@nestjs/common';
import { CatalogLocalizerService } from '../../rick-and-morty/application/catalog-localizer.service.js';
import { toLocalPage } from '../../rick-and-morty/application/catalog-pagination.js';
import { CatalogGateway } from '../../rick-and-morty/application/ports/catalog-gateway.port.js';
import type { LocationsQueryContract } from './contracts/locations-query.contract.js';

@Injectable()
export class LocationsService {
  constructor(
    private readonly api: CatalogGateway,
    private readonly localizer: CatalogLocalizerService,
  ) {}
  async list(query: LocationsQueryContract) {
    const page = await this.api.getLocationsPage(query);
    return {
      ...toLocalPage('locations', page),
      results: page.results.map((location) =>
        this.localizer.location(location),
      ),
    };
  }
  async getById(id: number) {
    const location = await this.api.getLocation(id);
    return this.localizer.location(location);
  }
  async getMany(ids: number[]) {
    const locations = await this.api.getLocations(ids);
    return locations.map((location) => this.localizer.location(location));
  }
}
