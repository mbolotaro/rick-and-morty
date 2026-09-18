import 'server-only';

import { authRequest } from '@/lib/auth/server';
import { parseResponse } from '@/lib/http/server';
import type { FavoriteResource } from '@/lib/favorites/types';
import { commentsSchema, type Comment } from './types';

export async function getComments(
  resource: FavoriteResource,
  externalId: number,
): Promise<Comment[]> {
  const response = await authRequest(`/comments/${resource}/${externalId}`);

  if (response.status === 401) return [];
  return parseResponse(response, commentsSchema, 'comments');
}
