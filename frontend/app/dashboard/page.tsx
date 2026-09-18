import { redirect } from 'next/navigation';
import { signOutAction } from '@/app/auth/actions';
import { hasSession } from '@/lib/auth/server';

export default async function DashboardPage() {
  if (!(await hasSession())) redirect('/login');
  return <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8"><h1 className="text-3xl font-bold">Sessão autenticada</h1><p>Validação feita no servidor via cookies HTTP-only.</p><form action={signOutAction}><button className="rounded bg-zinc-900 px-4 py-2 text-white">Sair</button></form></main>;
}
