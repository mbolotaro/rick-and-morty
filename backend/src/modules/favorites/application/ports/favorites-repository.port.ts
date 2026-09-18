import type { CatalogResource } from '../../../rick-and-morty/application/contracts/catalog.models.js';

export interface FavoriteCollection {
  characters: number[];
  locations: number[];
  episodes: number[];
}

export abstract class FavoritesRepository {
  abstract list(userId: string): Promise<FavoriteCollection>;
  abstract exists(
    userId: string,
    resource: CatalogResource,
    externalId: number,
  ): Promise<boolean>;
  abstract add(
    userId: string,
    resource: CatalogResource,
    externalId: number,
  ): Promise<void>;
  abstract remove(
    userId: string,
    resource: CatalogResource,
    externalId: number,
  ): Promise<void>;
}
