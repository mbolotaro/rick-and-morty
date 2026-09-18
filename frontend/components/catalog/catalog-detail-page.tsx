import { notFound } from 'next/navigation';
import { getResource, type CatalogResource } from '@/lib/catalog/server';
import { CatalogShell } from './catalog-shell';
import { ResourceDetail } from './resource-detail';

interface CatalogDetailPageProps {
  resource: Exclude<CatalogResource, 'characters'>;
  id: string;
}

export async function CatalogDetailPage({ resource, id }: CatalogDetailPageProps) {
  const item = await getResource(resource, id);
  if (!item) notFound();

  return (
    <CatalogShell>
      <ResourceDetail resource={resource} item={item} />
    </CatalogShell>
  );
}
