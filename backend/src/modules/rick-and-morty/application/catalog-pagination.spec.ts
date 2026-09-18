import { describe, expect, it } from 'vitest';
import { toLocalPage } from './catalog-pagination.js';

describe('toLocalPage', () => {
  it('preserves page data and converts external pagination URLs to local URLs', () => {
    const page = toLocalPage('characters', {
      info: {
        count: 826,
        pages: 42,
        next: 'https://rickandmortyapi.com/api/character?page=2&status=alive',
        prev: null,
      },
      results: [{ id: 1, name: 'Rick Sanchez' }],
    });

    expect(page).toEqual({
      info: {
        count: 826,
        pages: 42,
        next: '/characters?page=2&status=alive',
        prev: null,
      },
      results: [{ id: 1, name: 'Rick Sanchez' }],
    });
  });

  it('does not require an absolute URL to preserve query parameters', () => {
    const page = toLocalPage('episodes', {
      info: { count: 1, pages: 1, next: '?page=2', prev: '?page=1' },
      results: [],
    });

    expect(page.info).toMatchObject({
      next: '/episodes?page=2',
      prev: '/episodes?page=1',
    });
  });
});
