import Link from 'next/link';
import { ArrowRight, CalendarDays, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';
import type { Episode } from '@/lib/catalog/server';
import styles from './dashboard.module.css';

interface EpisodeListProps {
  episodes: Episode[];
}

export function EpisodeList({ episodes }: EpisodeListProps) {
  const t = useTranslations('Dashboard');

  return (
    <section className={styles.episodeSection}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.cardKicker}>{t('initialSelection')}</span>
          <h2>{t('episodesToExplore')}</h2>
        </div>
        <Link className={styles.textLink} href="/episodes">
          {t('viewCatalog')} <ArrowRight size={15} />
        </Link>
      </div>

      <div className={styles.episodeGrid}>
        {episodes.map((episode, index) => (
          <Link
            href={`/episodes/${episode.id}`}
            className={styles.episodeCard}
            style={{ '--delay': `${index * 70}ms` } as CSSProperties}
            key={episode.id}
          >
            <div className={styles.episodeMeta}>
              <span>{episode.episode}</span>
              <span className={styles.playIcon}><Play size={18} fill="currentColor" /></span>
            </div>
            <h3>{episode.name}</h3>
            <p><CalendarDays size={14} /> {episode.air_date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
