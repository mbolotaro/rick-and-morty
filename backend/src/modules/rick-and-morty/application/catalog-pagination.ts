import type { CatalogPage, CatalogResource } from './contracts/catalog.models.js';

function localUrl(resource: CatalogResource, url: string | null): string | null {
  if (!url) return null;

  const queryStart = url.indexOf('?');
  const query = queryStart >= 0 ? url.slice(queryStart) : '';
  return `/${resource}${query}`;
}

export function toLocalPage<T>(resource: CatalogResource, page: CatalogPage<T>): CatalogPage<T> {
  return {
    ...page,
    info: {
      ...page.info,
      next: localUrl(resource, page.info.next),
      prev: localUrl(resource, page.info.prev),
    },
  };
}
