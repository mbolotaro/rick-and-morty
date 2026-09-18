import { z } from 'zod';
import { CatalogResourceSchema } from '../../../../common/schemas/catalog-resource.schema.js';

export const CommentResourceParamsSchema = z.object({
  resource: CatalogResourceSchema,
  externalId: z.coerce.number().int().positive(),
});

export const CreateCommentSchema = z.object({
  content: z.string().trim().min(1).max(1000),
});

export const RateCommentParamsSchema = z.object({
  commentId: z.string().min(1),
});

export const RateCommentSchema = z.object({
  value: z.enum(['UP', 'DOWN']),
});

export type CommentResourceParams = z.infer<
  typeof CommentResourceParamsSchema
>;
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
export type RateCommentParams = z.infer<typeof RateCommentParamsSchema>;
export type RateCommentInput = z.infer<typeof RateCommentSchema>;
