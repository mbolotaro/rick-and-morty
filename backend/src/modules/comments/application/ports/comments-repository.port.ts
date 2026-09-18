import type { CatalogResource } from '../../../rick-and-morty/application/contracts/catalog.models.js';

export type CommentRatingValue = 'UP' | 'DOWN';

export interface CommentRatingSummary {
  up: number;
  down: number;
  current: CommentRatingValue | null;
}

export interface CommentRecord {
  id: string;
  content: string;
  createdAt: Date;
  externalId: number;
  resource: CatalogResource;
  author: { id: string; firstName: string; lastName: string };
  ratings: Array<{ userId: string; value: CommentRatingValue }>;
}

export interface CreateCommentInput {
  userId: string;
  resource: CatalogResource;
  externalId: number;
  content: string;
}

export abstract class CommentsRepository {
  abstract list(resource: CatalogResource, externalId: number): Promise<CommentRecord[]>;
  abstract create(input: CreateCommentInput): Promise<CommentRecord>;
  abstract exists(commentId: string): Promise<boolean>;
  abstract toggleRating(
    userId: string,
    commentId: string,
    value: CommentRatingValue,
  ): Promise<CommentRatingSummary>;
}
