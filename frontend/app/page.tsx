import { redirect } from 'next/navigation';
import { getSessionStatus } from '@/lib/auth/server';

export const instant = false;

export default async function Home() {
  const sessionStatus = await getSessionStatus();

  if (sessionStatus === 'refreshable') {
    redirect('/auth/refresh?returnTo=/dashboard');
  }

  redirect(sessionStatus === 'authenticated' ? '/dashboard' : '/login');
}
