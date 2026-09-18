'use client';

import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { signOutAction } from '@/app/auth/actions';
import { unwrapAction } from '@/lib/actions/result';
import { useActionMutation } from './use-action-mutation';

export function useSignOut() {
  const t = useTranslations('Auth');

  const mutation = useActionMutation<null, void>({
    mutationFn: async () => unwrapAction(await signOutAction()),
    onSuccess: () => {
      toast.success(t('signOutSuccess'));
    },
    redirectOnSuccess: '/login',
    refreshOnSuccess: true,
  });

  return {
    isPending: mutation.isPending,
    signOut: mutation.mutate,
  };
}
