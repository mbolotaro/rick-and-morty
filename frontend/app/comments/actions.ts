'use server';

import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { actionFailure, type ActionResult } from '@/lib/actions/result';
import { executeAction } from '@/lib/actions/execute';
import { createComment, rateComment } from '@/lib/comments/mutations';
import {
  COMMENT_MAX_LENGTH,
  commentRateSchema,
  type Comment,
  type CommentRate,
  type CommentRating,
} from '@/lib/comments/types';
import { favoriteResourceSchema, type FavoriteResource } from '@/lib/favorites/types';
import { ApiError } from '@/lib/http/api-error';

interface CreateCommentInput {
  resource: FavoriteResource;
  externalId: number;
  content: string;
}

interface RateCommentInput {
  resource: FavoriteResource;
  externalId: number;
  commentId: string;
  value: CommentRate;
}

function resourcePath(resource: FavoriteResource, externalId: number): string {
  return `/${resource}/${externalId}`;
}

export async function createCommentAction(
  input: CreateCommentInput,
): Promise<ActionResult<Comment>> {
  const t = await getTranslations('Errors');
  const resource = favoriteResourceSchema.safeParse(input.resource);
  const content = input.content.trim();

  if (!resource.success || !Number.isInteger(input.externalId) || input.externalId <= 0 || !content || content.length > COMMENT_MAX_LENGTH) {
    return actionFailure(new ApiError(t('invalidComment'), 400), t('invalidComment'));
  }

  return executeAction(async () => {
    const comment = await createComment(resource.data, input.externalId, content);
    revalidatePath(resourcePath(resource.data, input.externalId));
    return comment;
  }, t('commentMutation'));
}

export async function rateCommentAction(
  input: RateCommentInput,
): Promise<ActionResult<CommentRating>> {
  const t = await getTranslations('Errors');
  const resource = favoriteResourceSchema.safeParse(input.resource);
  const rate = commentRateSchema.safeParse(input.value);

  if (!resource.success || !rate.success || !input.commentId || !Number.isInteger(input.externalId) || input.externalId <= 0) {
    return actionFailure(new ApiError(t('invalidRating'), 400), t('invalidRating'));
  }

  return executeAction(async () => {
    const rating = await rateComment(input.commentId, rate.data);
    revalidatePath(resourcePath(resource.data, input.externalId));
    return rating;
  }, t('ratingMutation'));
}
