import 'server-only';
import { z } from 'zod';
import { requestLanguage } from '../i18n/server';
import { parseResponse, serverFetch } from '../http/server';

export type CatalogResource = 'characters' | 'locations' | 'episodes';

const infoSchema = z.object({
  count: z.number().int(),
  pages: z.number().int(),
  next: z.string().nullable(),
  prev: z.string().nullable(),
});

const characterSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  status: z.string(),
  species: z.string(),
  type: z.string(),
  gender: z.string(),
  origin: z.object({ name: z.string(), url: z.string() }),
  location: z.object({ name: z.string(), url: z.string() }),
  image: z.string().url(),
  episode: z.array(z.string().url()),
  url: z.string().url(),
  created: z.string(),
});

const locationSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  type: z.string(),
  dimension: z.string(),
  residents: z.array(z.string().url()),
  url: z.string().url(),
  created: z.string(),
});

const episodeSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  air_date: z.string(),
  episode: z.string(),
  characters: z.array(z.string().url()),
  url: z.string().url(),
  created: z.string(),
});

export type Character = z.infer<typeof characterSchema>;
export type Location = z.infer<typeof locationSchema>;
export type Episode = z.infer<typeof episodeSchema>;
export type CatalogItem = Character | Location | Episode;
export type PageInfo = z.infer<typeof infoSchema>;

export interface CatalogPage {
  info: PageInfo;
  results: CatalogItem[];
}

export interface CharacterProfile {
  character: Character;
  episodes: Episode[];
  locations: Location[];
}

const characterProfileSchema = z.object({
  character: characterSchema,
  episodes: z.array(episodeSchema),
  locations: z.array(locationSchema),
});

const schemas = {
  characters: characterSchema,
  locations: locationSchema,
  episodes: episodeSchema,
} as const;

const baseUrl = process.env.BACKEND_URL ?? 'http://localhost:3040';

export async function listResource(
  resource: CatalogResource,
  query: Record<string, string | string[] | undefined>,
): Promise<CatalogPage> {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string' && value) params.set(key, value);
  }

  const queryString = params.size ? `?${params}` : '';
  const response = await serverFetch(`${baseUrl}/${resource}${queryString}`, {
    headers: { 'accept-language': await requestLanguage() },
    cache: 'no-store',
  });

  const schema = z.object({
    info: infoSchema,
    results: z.array(schemas[resource]),
  });

  return parseResponse(response, schema, 'catalog');
}

export async function getResource(
  resource: CatalogResource,
  id: string,
): Promise<CatalogItem | null> {
  const response = await serverFetch(`${baseUrl}/${resource}/${id}`, {
    headers: { 'accept-language': await requestLanguage() },
    cache: 'no-store',
  });

  if (response.status === 404) return null;

  return parseResponse(response, schemas[resource], 'resource');
}

export async function getCharacterProfile(
  id: string,
): Promise<CharacterProfile | null> {
  const response = await serverFetch(`${baseUrl}/characters/${id}/profile`, {
    headers: { 'accept-language': await requestLanguage() },
    cache: 'no-store',
  });

  if (response.status === 404) return null;

  return parseResponse(response, characterProfileSchema, 'resource');
}
