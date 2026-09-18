import { BadGatewayException, NotFoundException } from '@nestjs/common';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { EnvService } from '../../env/env.service.js';
import { characterFixture, episodeFixture } from '../../../../test/support/catalog-fixtures.js';
import { RickAndMortyApiClient } from './rick-and-morty-api.client.js';

function createSut() {
  const env = {
    get: vi.fn().mockReturnValue('https://rickandmortyapi.com/api'),
  } as EnvService;
  return new RickAndMortyApiClient(env);
}

function jsonResponse(body: object | object[], status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

afterEach(() => vi.unstubAllGlobals());

describe('RickAndMortyApiClient', () => {
  it('sends defined filters and validates a valid character page', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({
      info: { count: 1, pages: 1, next: null, prev: null }, results: [characterFixture],
    }));
    vi.stubGlobal('fetch', fetchMock);
    const client = createSut();

    await expect(client.getCharactersPage({ page: 2, status: 'alive', species: undefined })).resolves.toMatchObject({
      results: [{ id: characterFixture.id }],
    });
    expect(String(fetchMock.mock.calls[0][0])).toBe('https://rickandmortyapi.com/api/character?page=2&status=alive');
  });

  it('turns a missing filtered page into an empty page', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })));
    await expect(createSut().getEpisodesPage({ name: 'missing' })).resolves.toEqual({
      info: { count: 0, pages: 0, next: null, prev: null }, results: [],
    });
  });

  it('distinguishes a missing resource from a missing filtered page', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })));
    await expect(createSut().getCharacter(999)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('maps transport failures and upstream error statuses to a gateway error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(createSut().getEpisode(1)).rejects.toBeInstanceOf(BadGatewayException);

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    await expect(createSut().getEpisode(1)).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('rejects malformed upstream data instead of leaking it into the application', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ id: 1 })));
    await expect(createSut().getCharacter(1)).rejects.toBeInstanceOf(BadGatewayException);
  });

  it('does not call the API for an empty batch and supports a singleton batch response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(episodeFixture));
    vi.stubGlobal('fetch', fetchMock);
    const client = createSut();

    await expect(client.getEpisodes([])).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
    await expect(client.getEpisodes([episodeFixture.id])).resolves.toEqual([episodeFixture]);
  });
});
