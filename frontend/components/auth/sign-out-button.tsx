'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useSignOut } from '@/hooks/use-sign-out';
import styles from '@/components/app-shell/topbar.module.css';

export function SignOutButton() {
  const session = useSignOut();
  const t = useTranslations('Topbar');

  return (
    <Button
      className={styles.iconButton}
      variant="unstyled"
      disabled={session.isPending}
      type="button"
      onClick={() => session.signOut()}
      aria-label={t('signOut')}
    >
      <LogOut size={19} />
    </Button>
  );
}
