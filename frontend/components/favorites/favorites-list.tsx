import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { CatalogItem } from '@/lib/catalog/server';
import type { FavoriteResource } from '@/lib/favorites/types';
import { FavoriteButton } from './favorite-button';
import styles from './favorites.module.css';

export interface FavoriteGroup {
  resource: FavoriteResource;
  label: string;
  items: CatalogItem[];
}

interface FavoritesListProps {
  groups: FavoriteGroup[];
}

function subtitle(item: CatalogItem): string {
  if ('status' in item) return `${item.status} · ${item.species}`;
  if ('dimension' in item) return item.dimension;
  return `${item.episode} · ${item.air_date}`;
}

export function FavoritesList({ groups }: FavoritesListProps) {
  const t = useTranslations('Favorites');

  return (
    <main className={styles.favoritesPage}>
      <header className={styles.pageHeader}>
        <span>{t('myCollection')}</span>
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </header>

      {groups.map((group) => (
        group.items.length > 0 && (
          <section className={styles.favoriteGroup} key={group.resource}>
            <div className={styles.groupHeader}>
              <h2>{group.label}</h2>
              <span>{group.items.length}</span>
            </div>

            <div className={styles.favoriteGrid}>
              {group.items.map((item) => (
                <article className={styles.favoriteCard} key={`${group.resource}-${item.id}`}>
                  <Link href={`/${group.resource}/${item.id}`}>
                    {'image' in item ? (
                      <Image src={item.image} alt={item.name} width={500} height={345} />
                    ) : (
                      <span className={styles.favoriteVisual} aria-hidden="true" />
                    )}
                    <span className={styles.favoriteCopy}>
                      <strong>{item.name}</strong>
                      <small>{subtitle(item)}</small>
                    </span>
                  </Link>
                  <FavoriteButton resource={group.resource} externalId={item.id} liked />
                </article>
              ))}
            </div>
          </section>
        )
      ))}
    </main>
  );
}
