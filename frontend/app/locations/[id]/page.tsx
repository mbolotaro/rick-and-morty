import { notFound } from 'next/navigation';
import { CatalogShell } from '@/components/catalog/catalog-shell';
import { ResourceDetail } from '@/components/catalog/resource-detail';
import { getResource } from '@/lib/catalog/server';

export const instant = false;

export default async function LocationPage({ params }: PageProps<'/locations/[id]'>) {
  const { id } = await params;
  const item = await getResource('locations', id);

  if (!item) notFound();

  return (
    <CatalogShell>
      <ResourceDetail resource="locations" item={item} />
    </CatalogShell>
  );
}
