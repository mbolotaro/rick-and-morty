import { Injectable, NotFoundException } from '@nestjs/common';
import { translate } from '../../../common/i18n/translate.js';
import type { CatalogResource } from '../../../common/schemas/catalog-resource.schema.js';
import type { Prisma } from '../../../generated/prisma/client.js';
import {
  CommentRate,
  CommentResource,
} from '../../../generated/prisma/enums.js';
import { CharactersService } from '../../characters/application/characters.service.js';
import { CatalogEpisodesService } from '../../episodes/application/catalog-episodes.service.js';
import { LocationsService } from '../../locations/application/locations.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type {
  CreateCommentInput,
  RateCommentInput,
} from '../presentation/schemas/comments.schema.js';

const commentInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
    },
  },
  ratings: {
    select: {
      userId: true,
      value: true,
    },
  },
} satisfies Prisma.CommentInclude;

type CommentWithRelations = Prisma.CommentGetPayload<{
  include: typeof commentInclude;
}>;

@Injectable()
export class CommentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly characters: CharactersService,
    private readonly locations: LocationsService,
    private readonly episodes: CatalogEpisodesService,
  ) {}

  async list(userId: string, resource: CatalogResource, externalId: number) {
    const comments = await this.prisma.comment.findMany({
      where: {
        resource: this.toDatabaseResource(resource),
        externalId,
      },
      include: commentInclude,
      orderBy: { createdAt: 'desc' },
    });

    return comments.map((comment) => this.toResponse(comment, userId));
  }

  async create(
    userId: string,
    resource: CatalogResource,
    externalId: number,
    input: CreateCommentInput,
  ) {
    await this.assertExternalResourceExists(resource, externalId);

    const comment = await this.prisma.comment.create({
      data: {
        userId,
        resource: this.toDatabaseResource(resource),
        externalId,
        content: input.content,
      },
      include: commentInclude,
    });

    return this.toResponse(comment, userId);
  }

  async rate(userId: string, commentId: string, input: RateCommentInput) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });

    if (!comment)
      throw new NotFoundException(
        translate('errors.comments.notFound', 'Comentário não encontrado.'),
      );

    const where = { userId_commentId: { userId, commentId } };
    const currentRating = await this.prisma.rateComment.findUnique({ where });

    if (currentRating?.value === input.value) {
      await this.prisma.rateComment.delete({ where });
    } else {
      await this.prisma.rateComment.upsert({
        where,
        create: { userId, commentId, value: input.value },
        update: { value: input.value },
      });
    }

    return this.ratingSummary(commentId, userId);
  }

  private async ratingSummary(commentId: string, userId: string) {
    const ratings = await this.prisma.rateComment.findMany({
      where: { commentId },
      select: { userId: true, value: true },
    });

    return {
      up: ratings.filter(({ value }) => value === CommentRate.UP).length,
      down: ratings.filter(({ value }) => value === CommentRate.DOWN).length,
      current: ratings.find((rating) => rating.userId === userId)?.value ?? null,
    };
  }

  private toResponse(comment: CommentWithRelations, userId: string) {
    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      externalId: comment.externalId,
      resource: this.fromDatabaseResource(comment.resource),
      author: comment.user,
      rating: {
        up: comment.ratings.filter(({ value }) => value === CommentRate.UP)
          .length,
        down: comment.ratings.filter(({ value }) => value === CommentRate.DOWN)
          .length,
        current:
          comment.ratings.find((rating) => rating.userId === userId)?.value ??
          null,
      },
    };
  }

  private toDatabaseResource(resource: CatalogResource): CommentResource {
    const resources: Record<CatalogResource, CommentResource> = {
      characters: CommentResource.CHARACTERS,
      locations: CommentResource.LOCATIONS,
      episodes: CommentResource.EPISODES,
    };

    return resources[resource];
  }

  private fromDatabaseResource(resource: CommentResource): CatalogResource {
    const resources: Record<CommentResource, CatalogResource> = {
      [CommentResource.CHARACTERS]: 'characters',
      [CommentResource.LOCATIONS]: 'locations',
      [CommentResource.EPISODES]: 'episodes',
    };

    return resources[resource];
  }

  private async assertExternalResourceExists(
    resource: CatalogResource,
    externalId: number,
  ): Promise<void> {
    switch (resource) {
      case 'characters':
        await this.characters.getById(externalId);
        break;
      case 'locations':
        await this.locations.getById(externalId);
        break;
      case 'episodes':
        await this.episodes.getById(externalId);
        break;
    }
  }
}
