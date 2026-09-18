import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { CatalogItem, CatalogPage, CatalogResource } from '@/lib/catalog/server';
import { getFilterOptions, type FilterName } from '@/lib/catalog/filter-options';
import styles from './catalog.module.css';

interface ResourceListProps {
  resource: CatalogResource;
  page: CatalogPage;
  query: Record<string, string | string[] | undefined>;
}

const filterNames: Record<CatalogResource, FilterName[]> = {
  characters: ['name', 'status', 'species', 'gender'],
  locations: ['name', 'type', 'dimension'],
  episodes: ['name', 'episode'],
};

function itemSubtitle(item: CatalogItem): string {
  if ('status' in item) return `${item.status} · ${item.species}`;
  if ('dimension' in item) return item.dimension;
  return `${item.episode} · ${item.air_date}`;
}

function paginationHref(resource: CatalogResource, apiUrl: string): string {
  const queryStart = apiUrl.indexOf('?');
  const query = queryStart >= 0 ? apiUrl.slice(queryStart) : '';

  return `/${resource}${query}`;
}

export function ResourceList({ resource, page, query }: ResourceListProps) {
  const t = useTranslations('Catalog');
  const resources: CatalogResource[] = ['characters', 'locations', 'episodes'];
  const resourceType =
    resource === 'episodes'
      ? t('episode')
      : resource === 'locations'
        ? t('location')
        : t('character');

  return (
    <main className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <h1>{t(resource)}</h1>
          <p>{t('results', { count: page.info.count })}</p>
        </div>

        <nav className={styles.tabs} aria-label={t('contentTypes')}>
          {resources.map((key) => (
            <Link data-active={key === resource} href={`/${key}`} key={key}>
              {t(key)}
            </Link>
          ))}
        </nav>
      </header>

      <form autoComplete="off" className={styles.filters}>
        <span className={styles.filterIcon}><SlidersHorizontal size={17} /></span>
        {filterNames[resource].map((filter) => {
          const filterOptions = getFilterOptions(filter);
          const defaultValue = typeof query[filter] === 'string' ? query[filter] : '';

          return (
            <FormField
              className={styles.filterField}
              htmlFor={`filter-${filter}`}
              label={t(`filters.${filter}`)}
              key={filter}
            >
              {filterOptions ? (
                <Select
                  key={`${filter}-${defaultValue}`}
                  id={`filter-${filter}`}
                  name={filter}
                  defaultValue={defaultValue}
                  placeholder={t('allOptions')}
                  ariaLabel={t(`filters.${filter}`)}
                  options={filterOptions.map((option) => ({
                    value: option.value,
                    label: t(option.label),
                  }))}
                />
              ) : (
                <Input
                  id={`filter-${filter}`}
                  name={filter}
                  defaultValue={defaultValue}
                  placeholder={t('filterBy', {
                    field: t(`filters.${filter}`).toLocaleLowerCase(),
                  })}
                />
              )}
            </FormField>
          );
        })}
        <Button type="submit"><Search size={16} /> {t('filter')}</Button>
      </form>

      <section className={styles.resourceGrid}>
        {page.results.map((item, index) => (
          <Link
            className={styles.resourceCard}
            data-has-image={'image' in item}
            href={`/${resource}/${item.id}`}
            style={{ '--card-index': index } as CSSProperties}
            key={item.id}
          >
            {'image' in item ? (
              <Image src={item.image} alt={item.name} width={500} height={345} />
            ) : null}
            <div className={styles.resourceCardContent}>
              <span>{resourceType}</span>
              <h2>{item.name}</h2>
              <p>{itemSubtitle(item)}</p>
            </div>
            <ArrowRight className={styles.resourceArrow} size={17} />
          </Link>
        ))}
      </section>

      <footer className={styles.pagination}>
        {page.info.prev ? (
          <Link href={paginationHref(resource, page.info.prev)}><ArrowLeft size={16} /> {t('previous')}</Link>
        ) : <span />}
        {page.info.next ? (
          <Link href={paginationHref(resource, page.info.next)}>{t('next')} <ArrowRight size={16} /></Link>
        ) : <span />}
      </footer>
    </main>
  );
}
