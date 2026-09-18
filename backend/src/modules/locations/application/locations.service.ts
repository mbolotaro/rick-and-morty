import { Injectable } from '@nestjs/common';
import { CatalogLocalizerService } from '../../rick-and-morty/application/catalog-localizer.service.js';
import { RickAndMortyApiClient } from '../../rick-and-morty/infrastructure/rick-and-morty-api.client.js';
import {
  LocationSchema,
  pageSchema,
} from '../../rick-and-morty/infrastructure/rick-and-morty.schemas.js';
import type { LocationsQueryContract } from './contracts/locations-query.contract.js';

@Injectable()
export class LocationsService {
  constructor(
    private readonly api: RickAndMortyApiClient,
    private readonly localizer: CatalogLocalizerService,
  ) {}
  async list(query: LocationsQueryContract) {
    const page = await this.api.getPage(
      'location',
      query,
      pageSchema(LocationSchema),
    );
    return {
      info: {
        ...page.info,
        next: this.localUrl(page.info.next),
        prev: this.localUrl(page.info.prev),
      },
      results: page.results.map((location) =>
        this.localizer.location(location),
      ),
    };
  }
  async getById(id: number) {
    const location = await this.api.getById('location', id, LocationSchema);
    return this.localizer.location(location);
  }
  async getMany(ids: number[]) {
    const locations = await this.api.getMany('location', ids, LocationSchema);
    return locations.map((location) => this.localizer.location(location));
  }
  private localUrl(url: string | null): string | null {
    return url ? `/locations${new URL(url).search}` : null;
  }
}
