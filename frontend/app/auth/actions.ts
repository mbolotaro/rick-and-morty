'use server';

import { getTranslations } from 'next-intl/server';
import { actionFailure, actionSuccess, type ActionResult } from '@/lib/actions/result';
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

  try {
    return actionSuccess((await signIn(parsed.data)).user);
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error : new Error(t('signIn')),
      t('signIn'),
    );
  }
}

export async function signUpAction(
  input: SignUpInput,
): Promise<ActionResult<AuthUser>> {
  const t = await getTranslations('Errors');
  const parsed = signUpInputSchema.safeParse(input);

  if (!parsed.success)
    return actionFailure(new ApiError(t('signUp'), 400), t('signUp'));

  try {
    return actionSuccess((await signUp(parsed.data)).user);
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error : new Error(t('signUp')),
      t('signUp'),
    );
  }
}

export async function signOutAction(): Promise<ActionResult<null>> {
  const t = await getTranslations('Errors');

  try {
    await signOut();
    return actionSuccess(null);
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error : new Error(t('signOut')),
      t('signOut'),
    );
  }
}
