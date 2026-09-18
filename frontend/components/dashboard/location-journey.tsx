import Link from 'next/link';
import { ArrowRight, Map } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Location } from '@/lib/catalog/server';
import styles from './dashboard.module.css';

interface LocationJourneyProps {
  locations: Location[];
}

export function LocationJourney({ locations }: LocationJourneyProps) {
  const t = useTranslations('Dashboard');

  return (
    <section className={styles.journeyCard}>
      <div className={styles.sectionHeader}>
        <div>
          <span className={styles.cardKicker}>{t('knownRoutes')}</span>
          <h2>{t('destinations')}</h2>
        </div>
        <Link className={styles.textLink} href="/locations">
          {t('viewAll')} <ArrowRight size={15} />
        </Link>
      </div>

      <div className={styles.locationList}>
        {locations.map((location, index) => (
          <Link href={`/locations/${location.id}`} className={styles.locationItem} key={location.id}>
            <span className={styles.locationIndex}>{String(index + 1).padStart(2, '0')}</span>
            <span>
              <strong>{location.name}</strong>
              <small>{location.type || t('unknownPlace')}</small>
            </span>
            <Map size={17} />
          </Link>
        ))}
      </div>
    </section>
  );
}
