import Link from 'next/link';
import { ArrowUpRight, Clapperboard, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties, ReactNode } from 'react';
import type { Episode, Location } from '@/lib/catalog/server';
import styles from './catalog.module.css';

interface CharacterRelationsProps {
  episodes: Episode[];
  locations: Location[];
}

interface RelationSectionProps {
  title: string;
  countLabel: string;
  emptyLabel: string;
  children: ReactNode;
}

function RelationSection({
  title,
  countLabel,
  emptyLabel,
  children,
}: RelationSectionProps) {
  return (
    <section className={styles.relationSection}>
      <header className={styles.relationHeader}>
        <h2>{title}</h2>
        <span>{countLabel}</span>
      </header>
      {children || <p className={styles.relationEmpty}>{emptyLabel}</p>}
    </section>
  );
}

export async function CharacterRelations({
  episodes,
  locations,
}: CharacterRelationsProps) {
  const t = await getTranslations('CharacterProfile');

  return (
    <div className={styles.characterRelations}>
      <RelationSection
        title={t('episodesTitle')}
        countLabel={t('episodesCount', { count: episodes.length })}
        emptyLabel={t('episodesEmpty')}
      >
        {episodes.length > 0 ? (
          <div className={styles.relationGrid}>
            {episodes.map((episode, index) => (
              <Link
                className={styles.relationCard}
                href={`/episodes/${episode.id}`}
                style={{ '--relation-index': index } as CSSProperties}
                key={episode.id}
              >
                <span className={styles.relationIcon}><Clapperboard size={18} /></span>
                <div>
                  <span>{episode.episode}</span>
                  <h3>{episode.name}</h3>
                  <p>{episode.air_date}</p>
                </div>
                <ArrowUpRight className={styles.relationArrow} size={17} />
              </Link>
            ))}
          </div>
        ) : null}
      </RelationSection>

      <RelationSection
        title={t('locationsTitle')}
        countLabel={t('locationsCount', { count: locations.length })}
        emptyLabel={t('locationsEmpty')}
      >
        {locations.length > 0 ? (
          <div className={styles.relationGrid}>
            {locations.map((location, index) => (
              <Link
                className={styles.relationCard}
                href={`/locations/${location.id}`}
                style={{ '--relation-index': index } as CSSProperties}
                key={location.id}
              >
                <span className={styles.relationIcon}><MapPin size={18} /></span>
                <div>
                  <span>{location.type}</span>
                  <h3>{location.name}</h3>
                  <p>{location.dimension}</p>
                </div>
                <ArrowUpRight className={styles.relationArrow} size={17} />
              </Link>
            ))}
          </div>
        ) : null}
      </RelationSection>
    </div>
  );
}
