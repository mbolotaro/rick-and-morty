import { z } from 'zod';
import {
  CatalogResourceSchema,
  type CatalogResource,
} from '../../../../common/schemas/catalog-resource.schema.js';

export const FavoriteResourceSchema = CatalogResourceSchema;

export const FavoriteParamsSchema = z.object({
  resource: FavoriteResourceSchema,
  externalId: z.coerce.number().int().positive(),
});

export type FavoriteResource = CatalogResource;
export type FavoriteParams = z.infer<typeof FavoriteParamsSchema>;
