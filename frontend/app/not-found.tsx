import Link from 'next/link';
import { Telescope } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function NotFoundPage() {
  const t = await getTranslations('Errors');

  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <section className="max-w-lg rounded-3xl border-2 border-[var(--color-outline-strong)] bg-[var(--color-surface-primary)] p-10 shadow-[var(--shadow-cartoon-card)]">
        <Telescope className="mx-auto text-[var(--color-accent-primary)]" size={44} />
        <h1 className="mt-5 text-3xl font-bold">{t('notFoundTitle')}</h1>
        <p className="mt-3 text-[var(--color-text-secondary)]">{t('notFoundDescription')}</p>
        <Link className="mt-7 inline-flex rounded-xl bg-[var(--color-accent-primary)] px-4 py-3 font-bold text-[var(--color-text-on-accent)]" href="/dashboard">
          {t('backHome')}
        </Link>
      </section>
    </main>
  );
}
