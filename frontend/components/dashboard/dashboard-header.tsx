import styles from './dashboard.module.css';
import { useTranslations } from 'next-intl';

export function DashboardHeader() {
  const t = useTranslations('Dashboard');

  return (
    <header className={styles.hero}>
      <span className={styles.eyebrow}>{t('eyebrow')}</span>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </header>
  );
}
