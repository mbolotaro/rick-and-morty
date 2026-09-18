'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signOutAction } from '@/app/auth/actions';
import { unwrapAction } from '@/lib/actions/result';

export function useSignOut() {
  const router = useRouter();
  const t = useTranslations('Auth');

  const mutation = useMutation<null, Error>({
    mutationFn: async () => unwrapAction(await signOutAction()),
    onSuccess: () => {
      toast.success(t('signOutSuccess'));
      router.push('/login');
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    isPending: mutation.isPending,
    signOut: mutation.mutate,
  };
}
