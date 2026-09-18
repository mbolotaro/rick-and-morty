'use server';

import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { actionFailure, actionSuccess, type ActionResult } from '@/lib/actions/result';
import { setFavorite } from '@/lib/favorites/mutations';
import { favoriteResourceSchema, type FavoriteResource } from '@/lib/favorites/types';
import { ApiError } from '@/lib/http/api-error';

interface ToggleFavoriteInput {
  resource: FavoriteResource;
  externalId: number;
  liked: boolean;
}

export async function toggleFavoriteAction(
  input: ToggleFavoriteInput,
): Promise<ActionResult<boolean>> {
  const t = await getTranslations('Errors');
  const resource = favoriteResourceSchema.safeParse(input.resource);

  if (!resource.success || !Number.isInteger(input.externalId) || input.externalId <= 0) {
    return actionFailure(new ApiError(t('invalidFavorite'), 400), t('invalidFavorite'));
  }

  try {
    const liked = await setFavorite(resource.data, input.externalId, input.liked);
    revalidatePath(`/${resource.data}/${input.externalId}`);
    revalidatePath('/favorites');
    return actionSuccess(liked);
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error : new Error(t('favoriteMutation')),
      t('favoriteMutation'),
    );
  }
}
