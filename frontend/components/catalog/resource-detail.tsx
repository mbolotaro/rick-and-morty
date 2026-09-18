import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { FavoriteButton } from '@/components/favorites/favorite-button';
import { CommentsSection } from '@/components/comments/comments-section';
import type { CatalogItem, CatalogResource } from '@/lib/catalog/server';
import { getFavoriteStatus } from '@/lib/favorites/server';
import styles from './catalog.module.css';

interface ResourceDetailProps {
  resource: CatalogResource;
  item: CatalogItem;
  children?: ReactNode;
}

type Detail = readonly [label: string, value: string];

interface DetailLabels {
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: string;
  currentLocation: string;
  dimension: string;
  residents: string;
  code: string;
  airedAt: string;
  characters: string;
  notInformed: string;
}

function getDetails(item: CatalogItem, labels: DetailLabels): Detail[] {
  if ('status' in item) {
    return [
      [labels.status, item.status],
      [labels.species, item.species],
      [labels.type, item.type || labels.notInformed],
      [labels.gender, item.gender],
      [labels.origin, item.origin.name],
      [labels.currentLocation, item.location.name],
    ];
  }

  if ('dimension' in item) {
    return [
      [labels.type, item.type],
      [labels.dimension, item.dimension],
      [labels.residents, String(item.residents.length)],
    ];
  }

  return [
    [labels.code, item.episode],
    [labels.airedAt, item.air_date],
    [labels.characters, String(item.characters.length)],
  ];
}

export async function ResourceDetail({ resource, item, children }: ResourceDetailProps) {
  const [liked, t, common] = await Promise.all([
    getFavoriteStatus(resource, item.id),
    getTranslations('Catalog'),
    getTranslations('Common'),
  ]);
  const details = getDetails(item, {
    status: t('details.status'),
    species: t('details.species'),
    type: t('details.type'),
    gender: t('details.gender'),
    origin: t('details.origin'),
    currentLocation: t('details.currentLocation'),
    dimension: t('details.dimension'),
    residents: t('details.residents'),
    code: t('details.code'),
    airedAt: t('details.airedAt'),
    characters: t('details.characters'),
    notInformed: common('notInformed'),
  });

  return (
    <main className={styles.detailPage}>
      <Link className={styles.backLink} href={`/${resource}`}>
        <ArrowLeft size={16} /> {t('back')}
      </Link>

      <article className={styles.detailCard}>
        {'image' in item && (
          <Image src={item.image} alt={item.name} width={700} height={700} priority />
        )}
        <div className={styles.detailContent}>
          <span className={styles.eyebrow}>{t('record', { id: item.id })}</span>
          <h1>{item.name}</h1>
          <FavoriteButton resource={resource} externalId={item.id} liked={liked} />
          <dl>
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </article>

      {children}

      <CommentsSection resource={resource} externalId={item.id} />
    </main>
  );
}
