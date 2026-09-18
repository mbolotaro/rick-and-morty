'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';
import { toggleFavoriteAction } from '@/app/favorites/actions';
import { unwrapAction } from '@/lib/actions/result';
import type { FavoriteResource } from '@/lib/favorites/types';
import { useActionMutation } from './use-action-mutation';

interface FavoriteInput {
  resource: FavoriteResource;
  externalId: number;
  initialLiked: boolean;
}

export function useFavorite({ resource, externalId, initialLiked }: FavoriteInput) {
  const [liked, setLiked] = useState(initialLiked);
  const t = useTranslations('Favorites');

  const mutation = useActionMutation<boolean, void>({
    mutationFn: async () =>
      unwrapAction(
        await toggleFavoriteAction({
          resource,
          externalId,
          liked: !liked,
        }),
      ),
    onSuccess: (nextLiked) => {
      setLiked(nextLiked);
      toast.success(nextLiked ? t('added') : t('removed'));
    },
    refreshOnSuccess: true,
    redirectOnUnauthorized: '/login',
  });

  return {
    isPending: mutation.isPending,
    liked,
    toggle: mutation.mutate,
  };
}
