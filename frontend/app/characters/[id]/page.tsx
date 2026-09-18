import { notFound } from 'next/navigation';
import { CatalogShell } from '@/components/catalog/catalog-shell';
import { CharacterRelations } from '@/components/catalog/character-relations';
import { ResourceDetail } from '@/components/catalog/resource-detail';
import { getCharacterProfile } from '@/lib/catalog/server';

export const instant = false;

export default async function CharacterPage({ params }: PageProps<'/characters/[id]'>) {
  const { id } = await params;
  const profile = await getCharacterProfile(id);

  if (!profile) notFound();

  return (
    <CatalogShell>
      <ResourceDetail resource="characters" item={profile.character}>
        <CharacterRelations
          episodes={profile.episodes}
          locations={profile.locations}
        />
      </ResourceDetail>
    </CatalogShell>
  );
}
