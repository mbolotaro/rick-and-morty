import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CircleDot, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Character } from '@/lib/catalog/server';
import styles from './dashboard.module.css';

interface FeaturedCharacterProps {
  character: Character;
}

export function FeaturedCharacter({ character }: FeaturedCharacterProps) {
  const t = useTranslations('Dashboard');

  return (
    <article className={styles.featuredCard}>
      <Image src={character.image} alt={character.name} width={500} height={500} priority />
      <div className={styles.featuredContent}>
        <span className={styles.cardKicker}>{t('featuredCharacter')}</span>
        <h2>{character.name}</h2>
        <div className={styles.badges}>
          <span><CircleDot size={12} /> {character.status}</span>
          <span>{character.species}</span>
        </div>
        <p className={styles.locationLabel}>
          <MapPin size={15} />
          {character.location.name}
        </p>
        <Link className={styles.textLink} href={`/characters/${character.id}`}>
          {t('viewProfile')} <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
