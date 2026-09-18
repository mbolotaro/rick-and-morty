import Link from 'next/link';
import { ArrowUpRight, Clapperboard, MapPin, UsersRound, type LucideIcon } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import styles from './dashboard.module.css';

interface DashboardStatsProps {
  episodes: number;
  characters: number;
  locations: number;
}

interface StatCardProps {
  href: string;
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  tone: 'green' | 'cyan' | 'violet';
}

export function DashboardStats({ episodes, characters, locations }: DashboardStatsProps) {
  const t = useTranslations('Dashboard');

  return (
    <section className={styles.stats} aria-label={t('summary')}>
      <StatCard
        href="/episodes"
        label={t('episodes')}
        value={episodes}
        description={t('episodesDescription')}
        icon={Clapperboard}
        tone="green"
      />
      <StatCard
        href="/characters"
        label={t('characters')}
        value={characters}
        description={t('charactersDescription')}
        icon={UsersRound}
        tone="cyan"
      />
      <StatCard
        href="/locations"
        label={t('locations')}
        value={locations}
        description={t('locationsDescription')}
        icon={MapPin}
        tone="violet"
      />
    </section>
  );
}

function StatCard({ href, label, value, description, icon: Icon, tone }: StatCardProps) {
  const format = useFormatter();

  return (
    <Link className={styles.statCard} data-tone={tone} href={href}>
      <span className={styles.statIcon}>
        <Icon size={22} strokeWidth={1.8} />
      </span>
      <span className={styles.statCopy}>
        <span>{label}</span>
        <strong>{format.number(value)}</strong>
        <small>{description}</small>
      </span>
      <ArrowUpRight className={styles.cardArrow} size={17} />
    </Link>
  );
}
