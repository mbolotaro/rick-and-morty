import { UserRound } from 'lucide-react';
import { cacheLife } from 'next/cache';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { getCurrentUser } from '@/lib/auth/server';
import styles from './topbar.module.css';

async function Topbar() {
  'use cache: private';
  cacheLife({ stale: 60 });

  const [user, t, common] = await Promise.all([
    getCurrentUser(),
    getTranslations('Topbar'),
    getTranslations('Common'),
  ]);
  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : common('visitor');

  return (
    <header className={styles.topbar}>
      <div className={styles.profile}>
        <span className={styles.avatar} aria-hidden="true">
          <UserRound size={18} />
        </span>
        <span className={styles.profileCopy}>
          <small>{t('connectedAs')}</small>
          <strong>{displayName}</strong>
        </span>

        <SignOutButton />
      </div>
    </header>
  );
}

function TopbarFallback() {
  const t = useTranslations('Topbar');

  return (
    <header className={styles.topbar} aria-label={t('loadingUser')}>
      <span className={styles.profileSkeleton} />
    </header>
  );
}

export function TopbarBoundary() {
  return (
    <Suspense fallback={<TopbarFallback />}>
      <Topbar />
    </Suspense>
  );
}
