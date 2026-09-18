'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { createCommentAction } from '@/app/comments/actions';
import { ActionError, unwrapAction } from '@/lib/actions/result';
import { COMMENT_MAX_LENGTH, type Comment } from '@/lib/comments/types';
import type { FavoriteResource } from '@/lib/favorites/types';

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
  const router = useRouter();
  const t = useTranslations('Comments');

  const mutation = useMutation<Comment, Error>({
    mutationFn: async () =>
      unwrapAction(await createCommentAction({ resource, externalId, content })),
    onSuccess: () => {
      setContent('');
      toast.success(t('published'));
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
