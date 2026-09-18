import { Injectable } from '@nestjs/common';
import {
  ApplicationError,
  ApplicationErrorStatus,
} from '../../../common/errors/application-error.js';
import type { CatalogResource } from '../../rick-and-morty/application/contracts/catalog.models.js';
import { CatalogGateway } from '../../rick-and-morty/application/ports/catalog-gateway.port.js';
import type { CreateCommentContract } from './contracts/create-comment.contract.js';
import type { RateCommentContract } from './contracts/rate-comment.contract.js';
import { CommentsRepository, type CommentRecord } from './ports/comments-repository.port.js';

@Injectable()
export class CommentsService {
  constructor(
    private readonly repository: CommentsRepository,
    private readonly catalog: CatalogGateway,
  ) {}

  async list(userId: string, resource: CatalogResource, externalId: number) {
    const comments = await this.repository.list(resource, externalId);
    return comments.map((comment) => this.toResponse(comment, userId));
  }

  async create(
    userId: string,
    resource: CatalogResource,
    externalId: number,
    input: CreateCommentContract,
  ) {
    await this.catalog.getResource(resource, externalId);
    const comment = await this.repository.create({
      userId,
      resource,
      externalId,
      content: input.content,
    });
    return this.toResponse(comment, userId);
  }

  async rate(userId: string, commentId: string, input: RateCommentContract) {
    if (!(await this.repository.exists(commentId))) {
      throw new ApplicationError(
        ApplicationErrorStatus.NotFound,
        'errors.comments.notFound',
        'Comment not found.',
      );
    }
    return this.repository.toggleRating(userId, commentId, input.value);
  }

  private toResponse(comment: CommentRecord, userId: string) {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      externalId: comment.externalId,
      resource: comment.resource,
      author: comment.author,
      rating: {
        up: comment.ratings.filter(({ value }) => value === 'UP').length,
        down: comment.ratings.filter(({ value }) => value === 'DOWN').length,
        current: comment.ratings.find((rating) => rating.userId === userId)?.value ?? null,
      },
    };
  }
}
