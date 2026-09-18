import { CatalogListPage } from '@/components/catalog/catalog-list-page';

export const instant = false;

export default async function LocationsPage({ searchParams }: PageProps<'/locations'>) {
  return <CatalogListPage resource="locations" searchParams={searchParams} />;
}
