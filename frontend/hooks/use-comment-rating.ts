'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { rateCommentAction } from '@/app/comments/actions';
import { unwrapAction } from '@/lib/actions/result';
import type { CommentRate, CommentRating } from '@/lib/comments/types';
import type { FavoriteResource } from '@/lib/favorites/types';
import { useActionMutation } from './use-action-mutation';

interface RatingInput {
  resource: FavoriteResource;
  externalId: number;
  commentId: string;
  value: CommentRate;
}

export function useCommentRating(input: RatingInput) {
  const t = useTranslations('Comments');

  const mutation = useActionMutation<CommentRating, void>({
    mutationFn: async () => unwrapAction(await rateCommentAction(input)),
    onSuccess: () => {
      toast.success(t('rated'));
    },
    refreshOnSuccess: true,
    redirectOnUnauthorized: '/login',
  });

  return {
    isPending: mutation.isPending,
    rate: mutation.mutate,
  };
}
