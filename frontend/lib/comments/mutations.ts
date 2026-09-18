import 'server-only';

import { getTranslations } from 'next-intl/server';
import { authRequest } from '@/lib/auth/server';
import { parseResponse } from '@/lib/http/server';
import type { FavoriteResource } from '@/lib/favorites/types';
import {
  COMMENT_MAX_LENGTH,
  commentRateSchema,
  commentRatingSchema,
  commentSchema,
  type Comment,
  type CommentRate,
  type CommentRating,
} from './types';

export async function createComment(
  resource: FavoriteResource,
  externalId: number,
  content: string,
): Promise<Comment> {
  const normalizedContent = content.trim();

  if (!normalizedContent || normalizedContent.length > COMMENT_MAX_LENGTH) {
    const t = await getTranslations('Errors');
    throw new Error(t('invalidComment'));
  }

  const response = await authRequest(`/comments/${resource}/${externalId}`, {
    method: 'POST',
    body: JSON.stringify({ content: normalizedContent }),
  });

  return parseResponse(response, commentSchema, 'commentMutation');
}

export async function rateComment(
  commentId: string,
  value: CommentRate,
): Promise<CommentRating> {
  const rating = commentRateSchema.parse(value);
  const response = await authRequest(`/comments/${commentId}/rating`, {
    method: 'PUT',
    body: JSON.stringify({ value: rating }),
  });

  return parseResponse(response, commentRatingSchema, 'ratingMutation');
}
