import { listResource, type CatalogResource } from '@/lib/catalog/server';
import { CatalogShell } from './catalog-shell';
import { ResourceList } from './resource-list';

interface CatalogListPageProps {
  resource: CatalogResource;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function CatalogListPage({ resource, searchParams }: CatalogListPageProps) {
  const query = await searchParams;
  const page = await listResource(resource, query);

  return (
    <CatalogShell>
      <ResourceList resource={resource} page={page} query={query} />
    </CatalogShell>
  );
}
