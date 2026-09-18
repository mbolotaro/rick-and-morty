import { createZodDto } from '../../../../common/validation/zod-dto.js';
import { z } from 'zod';
import { CatalogResourceSchema } from '../../../../common/schemas/catalog-resource.schema.js';

const commentResourceParamsSchema = z.object({
  resource: CatalogResourceSchema,
  externalId: z.coerce.number().int().positive(),
});

export interface CommentResourceParams {
  resource: 'characters' | 'locations' | 'episodes';
  externalId: number;
}
export class CommentResourceParamsDto extends createZodDto(commentResourceParamsSchema) {}
