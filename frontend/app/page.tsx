import { redirect } from 'next/navigation';
import { hasSession } from '@/lib/auth/server';

export default async function Home() {
  redirect((await hasSession()) ? '/dashboard' : '/login');
}
