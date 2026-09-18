'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { rateCommentAction } from '@/app/comments/actions';
import { ActionError, unwrapAction } from '@/lib/actions/result';
import type { CommentRate, CommentRating } from '@/lib/comments/types';
import type { FavoriteResource } from '@/lib/favorites/types';

interface RatingInput {
  resource: FavoriteResource;
  externalId: number;
  commentId: string;
  value: CommentRate;
}

export function useCommentRating(input: RatingInput) {
  const router = useRouter();
  const t = useTranslations('Comments');

  const mutation = useMutation<CommentRating, Error>({
    mutationFn: async () => unwrapAction(await rateCommentAction(input)),
    onSuccess: () => {
      toast.success(t('rated'));
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
    rate: mutation.mutate,
  };
}
