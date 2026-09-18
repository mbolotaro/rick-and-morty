import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { CurrentUser } from '../../auth/current-user.decorator.js';
import type { CurrentUserPayload } from '../../auth/current-user.decorator.js';
import { CommentsService } from '../application/comments.service.js';
import {
  CommentResourceParamsSchema,
  CreateCommentSchema,
  RateCommentParamsSchema,
  RateCommentSchema,
  type CommentResourceParams,
  type CreateCommentInput,
  type RateCommentInput,
  type RateCommentParams,
} from './schemas/comments.schema.js';

@ApiTags('comments')
@ApiCookieAuth('access_token')
@Controller('comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Get(':resource/:externalId')
  list(
    @CurrentUser() user: CurrentUserPayload,
    @Param(new ZodValidationPipe(CommentResourceParamsSchema))
    params: CommentResourceParams,
  ) {
    return this.comments.list(
      user.sub,
      params.resource,
      params.externalId,
    );
  }

  @Post(':resource/:externalId')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['content'],
      properties: { content: { type: 'string', minLength: 1, maxLength: 1000 } },
    },
  })
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Param(new ZodValidationPipe(CommentResourceParamsSchema))
    params: CommentResourceParams,
    @Body(new ZodValidationPipe(CreateCommentSchema)) input: CreateCommentInput,
  ) {
    return this.comments.create(
      user.sub,
      params.resource,
      params.externalId,
      input,
    );
  }

  @Put(':commentId/rating')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['value'],
      properties: { value: { type: 'string', enum: ['UP', 'DOWN'] } },
    },
  })
  rate(
    @CurrentUser() user: CurrentUserPayload,
    @Param(new ZodValidationPipe(RateCommentParamsSchema))
    params: RateCommentParams,
    @Body(new ZodValidationPipe(RateCommentSchema)) input: RateCommentInput,
  ) {
    return this.comments.rate(user.sub, params.commentId, input);
  }
}
