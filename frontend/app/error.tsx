'use client';

import Link from 'next/link';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('Errors');
  const common = useTranslations('Common');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <section className="max-w-lg rounded-3xl border-2 border-[var(--color-outline-strong)] bg-[var(--color-surface-primary)] p-10 shadow-[var(--shadow-cartoon-card)]">
        <TriangleAlert className="mx-auto text-[var(--color-danger)]" size={42} />
        <h1 className="mt-5 text-3xl font-bold">{t('pageTitle')}</h1>
        <p className="mt-3 text-[var(--color-text-secondary)]">{t('pageDescription')}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button onClick={reset} type="button">
            <RotateCcw size={17} /> {common('retry')}
          </Button>
          <Link className="rounded-xl border-2 border-[var(--color-border-default)] px-4 py-3 font-bold" href="/dashboard">
            {t('backHome')}
          </Link>
        </div>
      </section>
    </main>
  );
}
