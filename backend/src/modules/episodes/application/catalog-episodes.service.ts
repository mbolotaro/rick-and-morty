import { Injectable } from '@nestjs/common';
import { CatalogLocalizerService } from '../../rick-and-morty/application/catalog-localizer.service.js';
import { RickAndMortyApiClient } from '../../rick-and-morty/infrastructure/rick-and-morty-api.client.js';
import {
  EpisodeSchema,
  pageSchema,
} from '../../rick-and-morty/infrastructure/rick-and-morty.schemas.js';
import type { EpisodesQuery } from '../presentation/schemas/episodes-query.schema.js';
@Injectable()
export class CatalogEpisodesService {
  constructor(
    private readonly api: RickAndMortyApiClient,
    private readonly localizer: CatalogLocalizerService,
  ) {}
  async list(query: EpisodesQuery) {
    const page = await this.api.getPage(
      'episode',
      query,
      pageSchema(EpisodeSchema),
    );
    return {
      info: {
        ...page.info,
        next: this.localUrl(page.info.next),
        prev: this.localUrl(page.info.prev),
      },
      results: page.results.map((episode) => this.localizer.episode(episode)),
    };
  }
  async getById(id: number) {
    const episode = await this.api.getById('episode', id, EpisodeSchema);
    return this.localizer.episode(episode);
  }
  async getMany(ids: number[]) {
    const episodes = await this.api.getMany('episode', ids, EpisodeSchema);
    return episodes.map((episode) => this.localizer.episode(episode));
  }
  private localUrl(url: string | null): string | null {
    return url ? `/episodes${new URL(url).search}` : null;
  }
}
