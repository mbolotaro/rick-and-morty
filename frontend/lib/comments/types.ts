import { z } from 'zod';
import { favoriteResourceSchema } from '@/lib/favorites/types';

export const COMMENT_MAX_LENGTH = 1000;

export const commentRateSchema = z.enum(['UP', 'DOWN']);

export const commentRatingSchema = z.object({
  up: z.number().int().nonnegative(),
  down: z.number().int().nonnegative(),
  current: commentRateSchema.nullable(),
});

export const commentSchema = z.object({
  id: z.string(),
  content: z.string().max(COMMENT_MAX_LENGTH),
  createdAt: z.string().datetime(),
  externalId: z.number().int().positive(),
  resource: favoriteResourceSchema,
  author: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  rating: commentRatingSchema,
});

export const commentsSchema = z.array(commentSchema);

export type CommentRate = z.infer<typeof commentRateSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type CommentRating = z.infer<typeof commentRatingSchema>;
