import { CatalogListPage } from '@/components/catalog/catalog-list-page';

export const instant = false;

export default async function CharactersPage({ searchParams }: PageProps<'/characters'>) {
  return <CatalogListPage resource="characters" searchParams={searchParams} />;
}
