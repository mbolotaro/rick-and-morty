import { z } from 'zod';

const urlOrEmpty = z.union([z.url(), z.literal('')]);

export const PageInfoSchema = z.object({
  count: z.number().int().nonnegative(),
  pages: z.number().int().nonnegative(),
  next: z.url().nullable(),
  prev: z.url().nullable(),
});

export const CharacterSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  status: z.string(),
  species: z.string(),
  type: z.string(),
  gender: z.string(),
  origin: z.object({ name: z.string(), url: urlOrEmpty }),
  location: z.object({ name: z.string(), url: urlOrEmpty }),
  image: z.url(),
  episode: z.array(z.url()),
  url: z.url(),
  created: z.string().datetime(),
});

export const LocationSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  type: z.string(),
  dimension: z.string(),
  residents: z.array(z.url()),
  url: z.url(),
  created: z.string().datetime(),
});

export const EpisodeSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  air_date: z.string(),
  episode: z.string(),
  characters: z.array(z.url()),
  url: z.url(),
  created: z.string().datetime(),
});

export type Character = z.infer<typeof CharacterSchema>;
export type Location = z.infer<typeof LocationSchema>;
export type Episode = z.infer<typeof EpisodeSchema>;

export const pageSchema = <T extends z.ZodType>(result: T) =>
  z.object({ info: PageInfoSchema, results: z.array(result) });
