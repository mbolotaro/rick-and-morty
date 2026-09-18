import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { translate } from '../../../common/i18n/translate.js';
import { EnvService } from '../../env/env.service.js';
import { z } from 'zod';

export interface ExternalPage<T> {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: T[];
}
export type ExternalQuery = Record<string, string | number | undefined>;

interface RequestOptions<T> {
  notFoundValue: T;
}

@Injectable()
export class RickAndMortyApiClient {
  constructor(private readonly env: EnvService) {}

  async getPage<T>(
    resource: string,
    query: ExternalQuery,
    schema: z.ZodType<ExternalPage<T>>,
  ): Promise<ExternalPage<T>> {
    return this.request(resource, schema, query, {
      notFoundValue: {
        info: { count: 0, pages: 0, next: null, prev: null },
        results: [],
      },
    });
  }

  async getById<T>(
    resource: string,
    id: number,
    schema: z.ZodType<T>,
  ): Promise<T> {
    return this.request(`${resource}/${id}`, schema);
  }

  async getMany<T>(
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
    query?: ExternalQuery,
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
