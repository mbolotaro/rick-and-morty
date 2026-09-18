import Link from 'next/link';
import { signInAction } from '@/app/auth/actions';

export default function LoginPage() {
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6"><h1 className="text-3xl font-bold">Entrar</h1><form action={signInAction} className="flex flex-col gap-4"><input required name="email" type="email" placeholder="E-mail" className="rounded border p-3" /><input required name="password" type="password" placeholder="Senha" className="rounded border p-3" /><button className="rounded bg-zinc-900 p-3 text-white">Entrar</button></form><Link className="underline" href="/register">Criar conta</Link></main>;
}
