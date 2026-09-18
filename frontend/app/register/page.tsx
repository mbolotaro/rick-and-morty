import Link from 'next/link';
import { signUpAction } from '@/app/auth/actions';

export default function RegisterPage() {
  return <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6"><h1 className="text-3xl font-bold">Criar conta</h1><form action={signUpAction} className="flex flex-col gap-4"><input required name="firstName" placeholder="Nome" className="rounded border p-3" /><input required name="lastName" placeholder="Sobrenome" className="rounded border p-3" /><input required name="email" type="email" placeholder="E-mail" className="rounded border p-3" /><input required name="password" type="password" minLength={8} placeholder="Senha" className="rounded border p-3" /><button className="rounded bg-zinc-900 p-3 text-white">Cadastrar</button></form><Link className="underline" href="/login">Já tenho uma conta</Link></main>;
}
