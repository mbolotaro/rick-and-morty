import 'server-only';

import { authRequest } from '@/lib/auth/server';
import { parseResponse } from '@/lib/http/server';
import { HttpStatus } from '@/lib/http/status';
import {
  favoriteCollectionSchema,
  favoriteStatusSchema,
  type FavoriteCollection,
  type FavoriteResource,
} from './types';

const emptyFavorites: FavoriteCollection = {
  characters: [],
  locations: [],
  episodes: [],
};

export async function getFavorites(): Promise<FavoriteCollection> {
  const response = await authRequest('/favorites');

  if (response.status === HttpStatus.Unauthorized) return emptyFavorites;
  return parseResponse(response, favoriteCollectionSchema, 'favorites');
}

export async function getFavoriteStatus(
  resource: FavoriteResource,
  externalId: number,
): Promise<boolean> {
  const response = await authRequest(`/favorites/${resource}/${externalId}`);

  if (response.status === HttpStatus.Unauthorized) return false;
  return (
    await parseResponse(response, favoriteStatusSchema, 'favoriteStatus')
  ).liked;
}
