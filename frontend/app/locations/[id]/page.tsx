import { CatalogDetailPage } from '@/components/catalog/catalog-detail-page';

export const instant = false;

export default async function LocationPage({ params }: PageProps<'/locations/[id]'>) {
  const { id } = await params;
  return <CatalogDetailPage resource="locations" id={id} />;
}
