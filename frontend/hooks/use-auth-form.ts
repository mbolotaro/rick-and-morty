'use client';

import { useTranslations } from 'next-intl';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
import { signInAction, signUpAction } from '@/app/auth/actions';
import { unwrapAction } from '@/lib/actions/result';
import type { AuthUser } from '@/lib/auth/types';
import { useActionMutation } from './use-action-mutation';

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
  const t = useTranslations('Auth');

  const mutation = useActionMutation<AuthUser, AuthFormValues>({
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
    },
    redirectOnSuccess: '/dashboard',
    refreshOnSuccess: true,
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
