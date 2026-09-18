import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from './favorites.module.css';

export function FavoritesEmpty() {
  const t = useTranslations('Favorites');

  return (
    <main className={styles.page}>
      <section className={styles.emptyState}>
        <span className={styles.icon}><Heart size={26} strokeWidth={1.6} /></span>
        <span className={styles.eyebrow}>{t('yourCollection')}</span>
        <h1>{t('emptyTitle')}</h1>
        <p>{t('emptyDescription')}</p>
        <Link href="/characters">{t('exploreCharacters')} <ArrowRight size={16} /></Link>
      </section>
    </main>
  );
}
