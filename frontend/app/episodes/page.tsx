import { CatalogListPage } from '@/components/catalog/catalog-list-page';

export const instant = false;

export default async function EpisodesPage({ searchParams }: PageProps<'/episodes'>) {
  return <CatalogListPage resource="episodes" searchParams={searchParams} />;
}
