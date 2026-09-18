import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { AppShell } from '@/components/app-shell/app-shell';
import { TopbarBoundary } from '@/components/app-shell/topbar';
import { FavoritesEmpty } from '@/components/favorites/favorites-empty';
import {
  FavoritesList,
  type FavoriteGroup,
} from '@/components/favorites/favorites-list';
import { getSessionStatus } from '@/lib/auth/server';
import { getResource, type CatalogItem } from '@/lib/catalog/server';
import { getFavorites } from '@/lib/favorites/server';
import type { FavoriteResource } from '@/lib/favorites/types';

export const instant = false;

async function loadItems(
  resource: FavoriteResource,
  ids: number[],
): Promise<CatalogItem[]> {
  const items = await Promise.all(
    ids.map((id) => getResource(resource, String(id))),
  );

  return items.filter((item): item is CatalogItem => item !== null);
}

export default async function FavoritesPage() {
  const sessionStatus = await getSessionStatus();

  if (sessionStatus === 'refreshable') {
    redirect('/auth/refresh?returnTo=/favorites');
  }

  if (sessionStatus === 'anonymous') redirect('/login');

  const [favorites, t] = await Promise.all([
    getFavorites(),
    getTranslations('Catalog'),
  ]);
  const [characters, locations, episodes] = await Promise.all([
    loadItems('characters', favorites.characters),
    loadItems('locations', favorites.locations),
    loadItems('episodes', favorites.episodes),
  ]);
  const groups: FavoriteGroup[] = [
    { resource: 'characters', label: t('characters'), items: characters },
    { resource: 'locations', label: t('locations'), items: locations },
    { resource: 'episodes', label: t('episodes'), items: episodes },
  ];
  const isEmpty = groups.every((group) => group.items.length === 0);

  return (
    <AppShell>
      <TopbarBoundary />
      {isEmpty ? <FavoritesEmpty /> : <FavoritesList groups={groups} />}
    </AppShell>
  );
}
