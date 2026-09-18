import { CatalogShell } from '@/components/catalog/catalog-shell';
import { ResourceList } from '@/components/catalog/resource-list';
import { listResource } from '@/lib/catalog/server';

export const instant = false;

export default async function CharactersPage({ searchParams }: PageProps<'/characters'>) {
  const query = await searchParams;
  const page = await listResource('characters', query);

  return (
    <CatalogShell>
      <ResourceList resource="characters" page={page} query={query} />
    </CatalogShell>
  );
}
