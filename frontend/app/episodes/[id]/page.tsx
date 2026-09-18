import { notFound } from 'next/navigation';
import { CatalogShell } from '@/components/catalog/catalog-shell';
import { ResourceDetail } from '@/components/catalog/resource-detail';
import { getResource } from '@/lib/catalog/server';

export const instant = false;

export default async function EpisodePage({ params }: PageProps<'/episodes/[id]'>) {
  const { id } = await params;
  const item = await getResource('episodes', id);

  if (!item) notFound();

  return (
    <CatalogShell>
      <ResourceDetail resource="episodes" item={item} />
    </CatalogShell>
  );
}
