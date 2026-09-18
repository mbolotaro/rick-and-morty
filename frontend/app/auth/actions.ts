'use server';

import { getTranslations } from 'next-intl/server';
import { actionFailure, type ActionResult } from '@/lib/actions/result';
import { executeAction } from '@/lib/actions/execute';
import { signIn, signOut, signUp } from '@/lib/auth/mutations';
import {
  signInInputSchema,
  signUpInputSchema,
  type AuthUser,
  type SignInInput,
  type SignUpInput,
} from '@/lib/auth/types';
import { ApiError } from '@/lib/http/api-error';

export async function signInAction(
  input: SignInInput,
): Promise<ActionResult<AuthUser>> {
  const t = await getTranslations('Errors');
  const parsed = signInInputSchema.safeParse(input);

  if (!parsed.success)
    return actionFailure(new ApiError(t('signIn'), 400), t('signIn'));

  return executeAction(async () => (await signIn(parsed.data)).user, t('signIn'));
}

export async function signUpAction(
  input: SignUpInput,
): Promise<ActionResult<AuthUser>> {
  const t = await getTranslations('Errors');
  const parsed = signUpInputSchema.safeParse(input);

  if (!parsed.success)
    return actionFailure(new ApiError(t('signUp'), 400), t('signUp'));

  return executeAction(async () => (await signUp(parsed.data)).user, t('signUp'));
}

export async function signOutAction(): Promise<ActionResult<null>> {
  const t = await getTranslations('Errors');

  return executeAction(async () => {
    await signOut();
    return null;
  }, t('signOut'));
}
