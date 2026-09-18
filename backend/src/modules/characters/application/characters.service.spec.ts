import { describe, expect, it, vi } from 'vitest';
import { CharactersService } from './characters.service.js';
import { CatalogGateway } from '../../rick-and-morty/application/ports/catalog-gateway.port.js';
import { CatalogLocalizerService } from '../../rick-and-morty/application/catalog-localizer.service.js';
import { CatalogEpisodesService } from '../../episodes/application/catalog-episodes.service.js';
import { LocationsService } from '../../locations/application/locations.service.js';
import { characterFixture, episodeFixture, locationFixture } from '../../../../test/support/catalog-fixtures.js';

function createSut() {
  const catalog: CatalogGateway = {
    getCharactersPage: vi.fn().mockResolvedValue({
      info: { count: 1, pages: 1, next: null, prev: null }, results: [characterFixture],
    }),
    getCharacter: vi.fn().mockResolvedValue(characterFixture),
    getEpisodesPage: vi.fn(), getEpisode: vi.fn(), getEpisodes: vi.fn(),
    getLocationsPage: vi.fn(), getLocation: vi.fn(), getLocations: vi.fn(), getResource: vi.fn(),
  };
  const localizer = {
    character: vi.fn((character) => character),
  } as CatalogLocalizerService;
  const episodes = { getMany: vi.fn().mockResolvedValue([episodeFixture]) } as CatalogEpisodesService;
  const locations = { getMany: vi.fn().mockResolvedValue([locationFixture]) } as LocationsService;
  return { service: new CharactersService(catalog, localizer, episodes, locations), catalog, localizer, episodes, locations };
}

describe('CharactersService', () => {
  it('localizes a paginated result and rewrites remote pagination URLs', async () => {
    const { service, catalog, localizer } = createSut();
    vi.mocked(catalog.getCharactersPage).mockResolvedValue({
      info: {
        count: 2, pages: 2,
        next: 'https://rickandmortyapi.com/api/character?page=2',
        prev: 'https://rickandmortyapi.com/api/character?page=1',
      },
      results: [characterFixture],
    });

    const result = await service.list({ page: 1, status: 'alive' });

    expect(catalog.getCharactersPage).toHaveBeenCalledWith({ page: 1, status: 'alive' });
    expect(localizer.character).toHaveBeenCalledWith(characterFixture);
    expect(result.info).toMatchObject({ next: '/characters?page=2', prev: '/characters?page=1' });
  });

  it('loads the profile relations once and removes duplicated resource ids', async () => {
    const { service, episodes, locations } = createSut();
    const result = await service.getProfile(characterFixture.id);

    expect(episodes.getMany).toHaveBeenCalledWith([1, 2]);
    expect(locations.getMany).toHaveBeenCalledWith([1, 3]);
    expect(result).toEqual({ character: characterFixture, episodes: [episodeFixture], locations: [locationFixture] });
  });

  it('fails clearly when a character relation has an invalid resource URL', async () => {
    const { service, catalog } = createSut();
    vi.mocked(catalog.getCharacter).mockResolvedValue({ ...characterFixture, episode: ['invalid-url'] });
    await expect(service.getProfile(characterFixture.id)).rejects.toThrow('Invalid Rick and Morty resource URL');
  });
});
