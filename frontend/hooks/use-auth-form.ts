'use client';

import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { signInAction, signUpAction } from '@/app/auth/actions';
import { unwrapAction } from '@/lib/actions/result';
import type { AuthUser } from '@/lib/auth/types';

export type AuthMode = 'sign-in' | 'sign-up';

interface AuthFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthFormState {
  isPending: boolean;
  submit: (event: FormEvent<HTMLFormElement>) => void;
}

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? '').trim();
}

export function useAuthForm(mode: AuthMode): AuthFormState {
  const router = useRouter();
  const t = useTranslations('Auth');

  const mutation = useMutation<AuthUser, Error, AuthFormValues>({
    mutationFn: async (values) => {
      const result =
        mode === 'sign-in'
          ? await signInAction({
              email: values.email,
              password: values.password,
            })
          : await signUpAction(values);

      return unwrapAction(result);
    },
    onSuccess: () => {
      toast.success(mode === 'sign-in' ? t('signInSuccess') : t('signUpSuccess'));
      router.push('/dashboard');
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    mutation.mutate({
      firstName: field(formData, 'firstName'),
      lastName: field(formData, 'lastName'),
      email: field(formData, 'email'),
      password: field(formData, 'password'),
    });
  }

  return { isPending: mutation.isPending, submit };
}
