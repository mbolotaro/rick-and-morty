import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client.js';
import { CommentRate, CommentResource } from '../../../generated/prisma/enums.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CatalogResource } from '../../rick-and-morty/application/contracts/catalog.models.js';
import {
  CommentsRepository,
  type CommentRatingSummary,
  type CommentRatingValue,
  type CommentRecord,
  type CreateCommentInput,
} from '../application/ports/comments-repository.port.js';

const commentInclude = {
  user: { select: { id: true, firstName: true, lastName: true } },
  ratings: { select: { userId: true, value: true } },
} satisfies Prisma.CommentInclude;

type PrismaComment = Prisma.CommentGetPayload<{ include: typeof commentInclude }>;

@Injectable()
export class PrismaCommentsRepository extends CommentsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async list(resource: CatalogResource, externalId: number): Promise<CommentRecord[]> {
    const comments = await this.prisma.comment.findMany({
      where: { resource: this.toDatabaseResource(resource), externalId },
      include: commentInclude,
      orderBy: { createdAt: 'desc' },
    });
    return comments.map((comment) => this.toRecord(comment));
  }

  async create(input: CreateCommentInput): Promise<CommentRecord> {
    const comment = await this.prisma.comment.create({
      data: {
        userId: input.userId,
        resource: this.toDatabaseResource(input.resource),
        externalId: input.externalId,
        content: input.content,
      },
      include: commentInclude,
    });
    return this.toRecord(comment);
  }

  async exists(commentId: string): Promise<boolean> {
    return (await this.prisma.comment.count({ where: { id: commentId } })) > 0;
  }

  async toggleRating(userId: string, commentId: string, value: CommentRatingValue): Promise<CommentRatingSummary> {
    const where = { userId_commentId: { userId, commentId } };
    return this.prisma.$transaction(async (transaction) => {
      const current = await transaction.rateComment.findUnique({ where });

      if (current?.value === value) {
        await transaction.rateComment.delete({ where });
      } else {
        await transaction.rateComment.upsert({
          where,
          create: { userId, commentId, value },
          update: { value },
        });
      }

      const ratings = await transaction.rateComment.findMany({
        where: { commentId }, select: { userId: true, value: true },
      });
      return {
        up: ratings.filter(({ value: rating }) => rating === CommentRate.UP).length,
        down: ratings.filter(({ value: rating }) => rating === CommentRate.DOWN).length,
        current: ratings.find((rating) => rating.userId === userId)?.value ?? null,
      };
    });
  }

  private toRecord(comment: PrismaComment): CommentRecord {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      externalId: comment.externalId,
      resource: this.fromDatabaseResource(comment.resource),
      author: comment.user,
      ratings: comment.ratings,
    };
  }

  private toDatabaseResource(resource: CatalogResource): CommentResource {
    return {
      characters: CommentResource.CHARACTERS,
      locations: CommentResource.LOCATIONS,
      episodes: CommentResource.EPISODES,
    }[resource];
  }

  private fromDatabaseResource(resource: CommentResource): CatalogResource {
    const resources: Record<CommentResource, CatalogResource> = {
      [CommentResource.CHARACTERS]: 'characters',
      [CommentResource.LOCATIONS]: 'locations',
      [CommentResource.EPISODES]: 'episodes',
    };
    return resources[resource];
  }
}
