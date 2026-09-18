export type FavoriteResource = 'characters' | 'locations' | 'episodes';

export interface FavoriteParamsContract {
  resource: FavoriteResource;
  externalId: number;
}
