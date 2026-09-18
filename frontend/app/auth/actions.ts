'use server';

import { redirect } from 'next/navigation';
import { signIn, signOut, signUp } from '@/lib/auth/server';

function field(form: FormData, name: string): string {
  return String(form.get(name) ?? '').trim();
}

export async function signInAction(form: FormData): Promise<void> {
  try {
    await signIn({ email: field(form, 'email'), password: field(form, 'password') });
  } catch {
    redirect('/login?error=credentials');
  }
  redirect('/dashboard');
}

export async function signUpAction(form: FormData): Promise<void> {
  try {
    await signUp({
      firstName: field(form, 'firstName'),
      lastName: field(form, 'lastName'),
      email: field(form, 'email'),
      password: field(form, 'password'),
    });
  } catch {
    redirect('/register?error=signup');
  }
  redirect('/dashboard');
}

export async function signOutAction(): Promise<void> {
  await signOut();
  redirect('/login');
}
