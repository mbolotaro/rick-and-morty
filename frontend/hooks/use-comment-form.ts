'use client';

import { useTranslations } from 'next-intl';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { createCommentAction } from '@/app/comments/actions';
import { unwrapAction } from '@/lib/actions/result';
import { COMMENT_MAX_LENGTH, type Comment } from '@/lib/comments/types';
import type { FavoriteResource } from '@/lib/favorites/types';
import { useActionMutation } from './use-action-mutation';

interface CommentFormInput {
  resource: FavoriteResource;
  externalId: number;
}

interface CommentFormState {
  content: string;
  isPending: boolean;
  remainingCharacters: number;
  setContent: (value: string) => void;
  submit: (event: FormEvent<HTMLFormElement>) => void;
}

export function useCommentForm({ resource, externalId }: CommentFormInput): CommentFormState {
  const [content, setContent] = useState('');
  const t = useTranslations('Comments');

  const mutation = useActionMutation<Comment, void>({
    mutationFn: async () =>
      unwrapAction(await createCommentAction({ resource, externalId, content })),
    onSuccess: () => {
      setContent('');
      toast.success(t('published'));
    },
    refreshOnSuccess: true,
    redirectOnUnauthorized: '/login',
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    mutation.mutate();
  }

  return {
    content,
    isPending: mutation.isPending,
    remainingCharacters: COMMENT_MAX_LENGTH - content.length,
    setContent,
    submit,
  };
}
