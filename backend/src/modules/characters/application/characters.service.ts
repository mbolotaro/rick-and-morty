import { Injectable } from '@nestjs/common';
import { CatalogEpisodesService } from '../../episodes/application/catalog-episodes.service.js';
import { LocationsService } from '../../locations/application/locations.service.js';
import { CatalogLocalizerService } from '../../rick-and-morty/application/catalog-localizer.service.js';
import { toLocalPage } from '../../rick-and-morty/application/catalog-pagination.js';
import { CatalogGateway } from '../../rick-and-morty/application/ports/catalog-gateway.port.js';
import type { CharactersQueryContract } from './contracts/characters-query.contract.js';

@Injectable()
export class CharactersService {
  constructor(
    private readonly api: CatalogGateway,
    private readonly localizer: CatalogLocalizerService,
    private readonly episodes: CatalogEpisodesService,
    private readonly locations: LocationsService,
  ) {}

  async list(query: CharactersQueryContract) {
    const page = await this.api.getCharactersPage(query);
    return {
      ...toLocalPage('characters', page),
      results: page.results.map((character) =>
        this.localizer.character(character),
      ),
    };
  }

  async getById(id: number) {
    const character = await this.api.getCharacter(id);
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
}
