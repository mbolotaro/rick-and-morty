import { useTranslations } from 'next-intl';
import type { CatalogItem } from '@/lib/catalog/server';
import type { FavoriteResource } from '@/lib/favorites/types';
import { ResourceCard } from '@/components/catalog/resource-card';
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
              {group.items.map((item, index) => (
                <ResourceCard
                  action={<FavoriteButton resource={group.resource} externalId={item.id} liked />}
                  item={item}
                  index={index}
                  key={`${group.resource}-${item.id}`}
                  resource={group.resource}
                  resourceLabel={group.label}
                />
              ))}
            </div>
          </section>
        )
      ))}
    </main>
  );
}
