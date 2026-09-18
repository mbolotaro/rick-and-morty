import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import type { CatalogItem, CatalogResource } from '@/lib/catalog/server';
import styles from './resource-card.module.css';

interface ResourceCardProps {
  item: CatalogItem;
  resource: CatalogResource;
  resourceLabel: string;
  index: number;
  action?: ReactNode;
}

function subtitle(item: CatalogItem): string {
  if ('status' in item) return `${item.status} · ${item.species}`;
  if ('dimension' in item) return item.dimension;

  return `${item.episode} · ${item.air_date}`;
}

export function ResourceCard({ item, resource, resourceLabel, index, action }: ResourceCardProps) {
  const hasImage = 'image' in item;

  return (
    <article
      className={styles.card}
      data-has-image={hasImage}
      style={{ '--card-index': index } as CSSProperties}
    >
      <Link className={styles.link} href={`/${resource}/${item.id}`}>
        {hasImage ? <Image src={item.image} alt={item.name} width={500} height={345} /> : null}
        <div className={styles.content}>
          <span>{resourceLabel}</span>
          <h2>{item.name}</h2>
          <p>{subtitle(item)}</p>
        </div>
        <ArrowRight className={styles.arrow} size={17} />
      </Link>
      {action ? <div className={styles.action}>{action}</div> : null}
    </article>
  );
}
