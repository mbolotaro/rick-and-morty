import { Injectable } from '@nestjs/common';
import { CatalogEpisodesService } from '../../episodes/application/catalog-episodes.service.js';
import { LocationsService } from '../../locations/application/locations.service.js';
import { CatalogLocalizerService } from '../../rick-and-morty/application/catalog-localizer.service.js';
import { RickAndMortyApiClient } from '../../rick-and-morty/infrastructure/rick-and-morty-api.client.js';
import {
  CharacterSchema,
  pageSchema,
} from '../../rick-and-morty/infrastructure/rick-and-morty.schemas.js';
import type { CharactersQueryContract } from './contracts/characters-query.contract.js';

@Injectable()
export class CharactersService {
  constructor(
    private readonly api: RickAndMortyApiClient,
    private readonly localizer: CatalogLocalizerService,
    private readonly episodes: CatalogEpisodesService,
    private readonly locations: LocationsService,
  ) {}

  async list(query: CharactersQueryContract) {
    const page = await this.api.getPage(
      'character',
      query,
      pageSchema(CharacterSchema),
    );
    return {
      info: {
        ...page.info,
        next: this.localUrl(page.info.next),
        prev: this.localUrl(page.info.prev),
      },
      results: page.results.map((character) =>
        this.localizer.character(character),
      ),
    };
  }

  async getById(id: number) {
    const character = await this.api.getById('character', id, CharacterSchema);
    return this.localizer.character(character);
  }

  async getProfile(id: number) {
    const character = await this.getById(id);
    const episodeIds = character.episode.map((url) => this.externalId(url));
    const locationIds = [character.origin.url, character.location.url]
      .filter((url) => url.length > 0)
      .map((url) => this.externalId(url));

    const [episodes, locations] = await Promise.all([
      this.episodes.getMany([...new Set(episodeIds)]),
      this.locations.getMany([...new Set(locationIds)]),
    ]);

    return { character, episodes, locations };
  }

  private externalId(url: string): number {
    const id = Number(url.slice(url.lastIndexOf('/') + 1));

    if (!Number.isInteger(id) || id <= 0) {
      throw new TypeError(`Invalid Rick and Morty resource URL: ${url}`);
    }

    return id;
  }

  private localUrl(url: string | null): string | null {
    return url ? `/characters${new URL(url).search}` : null;
  }
}
