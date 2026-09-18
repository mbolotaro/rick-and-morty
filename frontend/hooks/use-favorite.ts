'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { toggleFavoriteAction } from '@/app/favorites/actions';
import { ActionError, unwrapAction } from '@/lib/actions/result';
import type { FavoriteResource } from '@/lib/favorites/types';

interface FavoriteInput {
  resource: FavoriteResource;
  externalId: number;
  initialLiked: boolean;
}

export function useFavorite({ resource, externalId, initialLiked }: FavoriteInput) {
  const [liked, setLiked] = useState(initialLiked);
  const router = useRouter();
  const t = useTranslations('Favorites');

  const mutation = useMutation<boolean, Error>({
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
      router.refresh();
    },
    onError: (error) => {
      if (error instanceof ActionError && error.status === 401) {
        router.push('/login');
        return;
      }

      toast.error(error.message);
    },
  });

  return {
    isPending: mutation.isPending,
    liked,
    toggle: mutation.mutate,
  };
}
