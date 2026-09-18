import { z } from 'zod';
const page = z.coerce.number().int().min(1).max(1000).optional();
export const EpisodesQuerySchema = z.object({
  page,
  name: z.string().trim().min(1).optional(),
  episode: z.string().trim().optional(),
});
export type EpisodesQuery = z.infer<typeof EpisodesQuerySchema>;
