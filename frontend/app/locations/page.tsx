import { CatalogShell } from '@/components/catalog/catalog-shell';
import { ResourceList } from '@/components/catalog/resource-list';
import { listResource } from '@/lib/catalog/server';

export const instant = false;

export default async function LocationsPage({ searchParams }: PageProps<'/locations'>) {
  const query = await searchParams;
  const page = await listResource('locations', query);

  return (
    <CatalogShell>
      <ResourceList resource="locations" page={page} query={query} />
    </CatalogShell>
  );
}
