import { z } from 'zod';

export const favoriteResourceSchema = z.enum([
  'characters',
  'locations',
  'episodes',
]);

export const favoriteCollectionSchema = z.object({
  characters: z.array(z.number().int().positive()),
  locations: z.array(z.number().int().positive()),
  episodes: z.array(z.number().int().positive()),
});

export const favoriteStatusSchema = z.object({
  liked: z.boolean(),
});

export type FavoriteResource = z.infer<typeof favoriteResourceSchema>;
export type FavoriteCollection = z.infer<typeof favoriteCollectionSchema>;
