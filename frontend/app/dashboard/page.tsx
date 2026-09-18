import { redirect } from 'next/navigation';
import { AppShell } from '@/components/app-shell/app-shell';
import { TopbarBoundary } from '@/components/app-shell/topbar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { EpisodeList } from '@/components/dashboard/episode-list';
import { FeaturedCharacter } from '@/components/dashboard/featured-character';
import { LocationJourney } from '@/components/dashboard/location-journey';
import { getSessionStatus } from '@/lib/auth/server';
import {
  listResource,
  type Character,
  type Episode,
  type Location,
} from '@/lib/catalog/server';
import styles from '@/components/dashboard/dashboard.module.css';

export const instant = false;

export default async function DashboardPage() {
  const sessionStatus = await getSessionStatus();

  if (sessionStatus === 'refreshable') {
    redirect('/auth/refresh?returnTo=/dashboard');
  }

  if (sessionStatus === 'anonymous') {
    redirect('/login');
  }

  const [characters, episodes, locations] = await Promise.all([
    listResource('characters', {}),
    listResource('episodes', {}),
    listResource('locations', {}),
  ]);

  const featuredCharacter = characters.results.find(
    (item): item is Character => 'image' in item,
  );
  const locationItems = locations.results
    .filter((item): item is Location => 'dimension' in item)
    .slice(0, 3);
  const episodeItems = episodes.results
    .filter((item): item is Episode => 'air_date' in item)
    .slice(0, 3);

  return (
    <AppShell>
      <TopbarBoundary />
      <main className={styles.dashboard}>
        <DashboardHeader />
        <DashboardStats
          episodes={episodes.info.count}
          characters={characters.info.count}
          locations={locations.info.count}
        />

        {featuredCharacter && (
          <div className={styles.featureGrid}>
            <FeaturedCharacter character={featuredCharacter} />
            <LocationJourney locations={locationItems} />
          </div>
        )}

        <EpisodeList episodes={episodeItems} />
      </main>
    </AppShell>
  );
}
