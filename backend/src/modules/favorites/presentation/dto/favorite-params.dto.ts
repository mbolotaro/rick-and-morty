import { z } from 'zod';
import { createZodDto } from '../../../../common/validation/zod-dto.js';
import {
  CatalogResourceSchema,
} from '../../../../common/schemas/catalog-resource.schema.js';

const favoriteResourceSchema = CatalogResourceSchema;

const favoriteParamsSchema = z.object({
  resource: favoriteResourceSchema,
  externalId: z.coerce.number().int().positive(),
});
export class FavoriteParamsDto extends createZodDto(favoriteParamsSchema) {}
