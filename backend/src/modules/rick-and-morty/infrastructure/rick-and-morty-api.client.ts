import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { translate } from '../../../common/i18n/translate.js';
import { EnvService } from '../../env/env.service.js';
import { z } from 'zod';
import type {
  CatalogPage,
  CatalogQuery,
  Character,
  Episode,
  Location,
} from '../application/contracts/catalog.models.js';
import { CatalogGateway } from '../application/ports/catalog-gateway.port.js';
import {
  CharacterSchema,
  EpisodeSchema,
  LocationSchema,
  pageSchema,
} from './rick-and-morty.schemas.js';

interface RequestOptions<T> {
  notFoundValue: T;
}

@Injectable()
export class RickAndMortyApiClient extends CatalogGateway {
  constructor(private readonly env: EnvService) {
    super();
  }

  async getCharactersPage(query: CatalogQuery): Promise<CatalogPage<Character>> {
    return this.getPage('character', query, pageSchema(CharacterSchema));
  }

  async getCharacter(id: number): Promise<Character> {
    return this.getById('character', id, CharacterSchema);
  }

  async getResource(
    resource: 'characters' | 'locations' | 'episodes',
    id: number,
  ): Promise<Character | Location | Episode> {
    switch (resource) {
      case 'characters':
        return this.getCharacter(id);
      case 'locations':
        return this.getLocation(id);
      case 'episodes':
        return this.getEpisode(id);
    }
  }

  async getEpisodesPage(query: CatalogQuery): Promise<CatalogPage<Episode>> {
    return this.getPage('episode', query, pageSchema(EpisodeSchema));
  }

  async getEpisode(id: number): Promise<Episode> {
    return this.getById('episode', id, EpisodeSchema);
  }

  async getEpisodes(ids: number[]): Promise<Episode[]> {
    return this.getMany('episode', ids, EpisodeSchema);
  }

  async getLocationsPage(query: CatalogQuery): Promise<CatalogPage<Location>> {
    return this.getPage('location', query, pageSchema(LocationSchema));
  }

  async getLocation(id: number): Promise<Location> {
    return this.getById('location', id, LocationSchema);
  }

  async getLocations(ids: number[]): Promise<Location[]> {
    return this.getMany('location', ids, LocationSchema);
  }

  private async getPage<T>(
    resource: string,
    query: CatalogQuery,
    schema: z.ZodType<CatalogPage<T>>,
  ): Promise<CatalogPage<T>> {
    return this.request(resource, schema, query, {
      notFoundValue: {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      },
    });
  }

  private async getById<T>(
    resource: string,
    id: number,
    schema: z.ZodType<T>,
  ): Promise<T> {
    return this.request(`${resource}/${id}`, schema);
  }

  private async getMany<T>(
    resource: string,
    ids: number[],
    schema: z.ZodType<T>,
  ): Promise<T[]> {
    if (ids.length === 0) return [];

    const responseSchema = z.union([schema, z.array(schema)]);
    const result = await this.request(
      `${resource}/${ids.join(',')}`,
      responseSchema,
    );

    return Array.isArray(result) ? result : [result];
  }

  private async request<T>(
    path: string,
    schema: z.ZodType<T>,
    query?: CatalogQuery,
    options?: RequestOptions<T>,
  ): Promise<T> {
    const url = new URL(`${this.env.get('RICK_AND_MORTY_API_URL')}/${path}`);

    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined && value !== '')
        url.searchParams.set(key, String(value));
    }

    let response: Response;
    try {
      response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    } catch {
      throw new BadGatewayException(
        translate(
          'errors.catalog.unavailable',
          'A API Rick and Morty não está disponível.',
        ),
      );
    }

    if (response.status === 404 && options) return options.notFoundValue;
    if (response.status === 404)
      throw new NotFoundException(
        translate('errors.catalog.notFound', 'Recurso não encontrado.'),
      );
    if (!response.ok)
      throw new BadGatewayException(
        translate(
          'errors.catalog.requestFailed',
          'Falha ao consultar a API Rick and Morty.',
        ),
      );
    const result = schema.safeParse(await response.json());
    if (!result.success) {
      throw new BadGatewayException(
        translate(
          'errors.catalog.invalidResponse',
          'A API Rick and Morty retornou dados inválidos.',
        ),
      );
    }
    return result.data;
  }
}
