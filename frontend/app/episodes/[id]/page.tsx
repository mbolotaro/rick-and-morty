import { CatalogDetailPage } from '@/components/catalog/catalog-detail-page';

export const instant = false;

export default async function EpisodePage({ params }: PageProps<'/episodes/[id]'>) {
  const { id } = await params;
  return <CatalogDetailPage resource="episodes" id={id} />;
}
