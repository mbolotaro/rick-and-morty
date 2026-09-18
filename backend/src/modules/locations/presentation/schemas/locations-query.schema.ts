import { z } from 'zod';
const page = z.coerce.number().int().min(1).max(1000).optional();
export const LocationsQuerySchema = z.object({
  page,
  name: z.string().trim().min(1).optional(),
  type: z.string().trim().optional(),
  dimension: z.string().trim().optional(),
});
export type LocationsQuery = z.infer<typeof LocationsQuerySchema>;
