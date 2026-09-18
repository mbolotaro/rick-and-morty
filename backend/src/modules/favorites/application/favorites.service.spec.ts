import { describe, expect, it, vi } from 'vitest';
import { FavoritesService } from './favorites.service.js';
import { FavoritesRepository } from './ports/favorites-repository.port.js';
import { CatalogGateway } from '../../rick-and-morty/application/ports/catalog-gateway.port.js';

function createSut() {
  const repository: FavoritesRepository = {
    list: vi.fn().mockResolvedValue({ characters: [1], locations: [2], episodes: [3] }),
    exists: vi.fn().mockResolvedValue(true),
    add: vi.fn(),
    remove: vi.fn(),
  };
  const catalog: CatalogGateway = {
    getCharactersPage: vi.fn(), getCharacter: vi.fn(), getEpisodesPage: vi.fn(), getEpisode: vi.fn(),
    getEpisodes: vi.fn(), getLocationsPage: vi.fn(), getLocation: vi.fn(), getLocations: vi.fn(),
    getResource: vi.fn(),
  };
  return { service: new FavoritesService(repository, catalog), repository, catalog };
}

describe('FavoritesService', () => {
  it('returns all favorite resource collections for the current user', async () => {
    const { service, repository } = createSut();
    await expect(service.list('user-1')).resolves.toEqual({ characters: [1], locations: [2], episodes: [3] });
    expect(repository.list).toHaveBeenCalledWith('user-1');
  });

  it('returns the favorite status without requesting the catalog', async () => {
    const { service, repository, catalog } = createSut();
    await expect(service.status('user-1', 'characters', 1)).resolves.toEqual({ liked: true });
    expect(repository.exists).toHaveBeenCalledWith('user-1', 'characters', 1);
    expect(catalog.getResource).not.toHaveBeenCalled();
  });

  it('checks the external resource before adding a favorite', async () => {
    const { service, repository, catalog } = createSut();
    await expect(service.add('user-1', 'episodes', 7)).resolves.toEqual({ liked: true });
    expect(catalog.getResource).toHaveBeenCalledWith('episodes', 7);
    expect(repository.add).toHaveBeenCalledWith('user-1', 'episodes', 7);
  });

  it('does not create a favorite when the catalog resource is unavailable', async () => {
    const { service, repository, catalog } = createSut();
    vi.mocked(catalog.getResource).mockRejectedValue(new Error('not found'));
    await expect(service.add('user-1', 'locations', 99)).rejects.toThrow('not found');
    expect(repository.add).not.toHaveBeenCalled();
  });

  it('removes a favorite idempotently', async () => {
    const { service, repository } = createSut();
    await expect(service.remove('user-1', 'locations', 2)).resolves.toEqual({ liked: false });
    expect(repository.remove).toHaveBeenCalledWith('user-1', 'locations', 2);
  });
});
