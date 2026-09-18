import { CatalogShell } from '@/components/catalog/catalog-shell';
import { ResourceList } from '@/components/catalog/resource-list';
import { listResource } from '@/lib/catalog/server';

export const instant = false;

export default async function EpisodesPage({ searchParams }: PageProps<'/episodes'>) {
  const query = await searchParams;
  const page = await listResource('episodes', query);

  return (
    <CatalogShell>
      <ResourceList resource="episodes" page={page} query={query} />
    </CatalogShell>
  );
}
