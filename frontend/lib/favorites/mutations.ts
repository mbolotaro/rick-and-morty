import 'server-only';

import { authRequest } from '@/lib/auth/server';
import { parseResponse } from '@/lib/http/server';
import { favoriteStatusSchema, type FavoriteResource } from './types';

export async function setFavorite(
  resource: FavoriteResource,
  externalId: number,
  liked: boolean,
): Promise<boolean> {
  const response = await authRequest(`/favorites/${resource}/${externalId}`, {
    method: liked ? 'PUT' : 'DELETE',
  });

  return (
    await parseResponse(response, favoriteStatusSchema, 'favoriteMutation')
  ).liked;
}
