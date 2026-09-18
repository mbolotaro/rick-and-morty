import { z } from 'zod';

export const CatalogResourceSchema = z.enum([
  'characters',
  'locations',
  'episodes',
]);

export type CatalogResource = z.infer<typeof CatalogResourceSchema>;
