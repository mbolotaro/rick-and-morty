import { describe, expect, it, vi } from 'vitest';
import { CatalogEpisodesService } from './catalog-episodes.service.js';
import { CatalogGateway } from '../../rick-and-morty/application/ports/catalog-gateway.port.js';
import { CatalogLocalizerService } from '../../rick-and-morty/application/catalog-localizer.service.js';
import { episodeFixture } from '../../../../test/support/catalog-fixtures.js';

describe('CatalogEpisodesService', () => {
  it('localizes list, detail and batch episode queries', async () => {
    const catalog: CatalogGateway = {
      getCharactersPage: vi.fn(), getCharacter: vi.fn(), getEpisodesPage: vi.fn().mockResolvedValue({
        info: { count: 1, pages: 1, next: null, prev: null }, results: [episodeFixture],
      }),
      getEpisode: vi.fn().mockResolvedValue(episodeFixture), getEpisodes: vi.fn().mockResolvedValue([episodeFixture]),
      getLocationsPage: vi.fn(), getLocation: vi.fn(), getLocations: vi.fn(), getResource: vi.fn(),
    };
    const localizer = { episode: vi.fn((episode) => ({ ...episode, name: 'Piloto' })) } as CatalogLocalizerService;
    const service = new CatalogEpisodesService(catalog, localizer);

    await expect(service.list({ page: 1 })).resolves.toMatchObject({ results: [{ name: 'Piloto' }] });
    await expect(service.getById(1)).resolves.toMatchObject({ name: 'Piloto' });
    await expect(service.getMany([1])).resolves.toEqual([expect.objectContaining({ name: 'Piloto' })]);
    expect(localizer.episode).toHaveBeenCalledTimes(3);
  });
});
