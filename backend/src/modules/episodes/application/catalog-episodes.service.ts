import { Injectable } from '@nestjs/common';
import { CatalogLocalizerService } from '../../rick-and-morty/application/catalog-localizer.service.js';
import { toLocalPage } from '../../rick-and-morty/application/catalog-pagination.js';
import { CatalogGateway } from '../../rick-and-morty/application/ports/catalog-gateway.port.js';
import type { EpisodesQueryContract } from './contracts/episodes-query.contract.js';
@Injectable()
export class CatalogEpisodesService {
  constructor(
    private readonly api: CatalogGateway,
    private readonly localizer: CatalogLocalizerService,
  ) {}
  async list(query: EpisodesQueryContract) {
    const page = await this.api.getEpisodesPage(query);
    return {
      ...toLocalPage('episodes', page),
      results: page.results.map((episode) => this.localizer.episode(episode)),
    };
  }
  async getById(id: number) {
    const episode = await this.api.getEpisode(id);
    return this.localizer.episode(episode);
  }
  async getMany(ids: number[]) {
    const episodes = await this.api.getEpisodes(ids);
    return episodes.map((episode) => this.localizer.episode(episode));
  }
}
