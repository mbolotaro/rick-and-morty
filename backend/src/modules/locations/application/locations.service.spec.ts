import { describe, expect, it, vi } from 'vitest';
import { LocationsService } from './locations.service.js';
import { CatalogGateway } from '../../rick-and-morty/application/ports/catalog-gateway.port.js';
import { CatalogLocalizerService } from '../../rick-and-morty/application/catalog-localizer.service.js';
import { locationFixture } from '../../../../test/support/catalog-fixtures.js';

describe('LocationsService', () => {
  it('localizes list, detail and batch location queries', async () => {
    const catalog: CatalogGateway = {
      getCharactersPage: vi.fn(), getCharacter: vi.fn(), getEpisodesPage: vi.fn(), getEpisode: vi.fn(), getEpisodes: vi.fn(),
      getLocationsPage: vi.fn().mockResolvedValue({
        info: { count: 1, pages: 1, next: null, prev: null }, results: [locationFixture],
      }),
      getLocation: vi.fn().mockResolvedValue(locationFixture), getLocations: vi.fn().mockResolvedValue([locationFixture]), getResource: vi.fn(),
    };
    const localizer = { location: vi.fn((location) => ({ ...location, type: 'Planeta' })) } as CatalogLocalizerService;
    const service = new LocationsService(catalog, localizer);

    await expect(service.list({ page: 1 })).resolves.toMatchObject({ results: [{ type: 'Planeta' }] });
    await expect(service.getById(1)).resolves.toMatchObject({ type: 'Planeta' });
    await expect(service.getMany([1])).resolves.toEqual([expect.objectContaining({ type: 'Planeta' })]);
    expect(localizer.location).toHaveBeenCalledTimes(3);
  });
});
