import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { ApiZodBody } from '../../../common/swagger/api-zod-body.decorator.js';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../../auth/presentation/decorators/current-user.decorator.js';
import { CommentsService } from '../application/comments.service.js';
import type { CreateCommentContract } from '../application/contracts/create-comment.contract.js';
import type { RateCommentContract } from '../application/contracts/rate-comment.contract.js';
import {
  CommentResourceParamsDto,
  type CommentResourceParams,
} from './dto/comment-resource-params.dto.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import {
  RateCommentParamsDto,
  type RateCommentParams,
} from './dto/rate-comment-params.dto.js';
import { RateCommentDto } from './dto/rate-comment.dto.js';

@ApiTags('comments')
@ApiCookieAuth('access_token')
@Controller('comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @Get(':resource/:externalId')
  list(
    @CurrentUser() user: CurrentUserPayload,
    @Param(new ZodValidationPipe(CommentResourceParamsDto))
    params: CommentResourceParams,
  ) {
    return this.comments.list(
      user.sub,
      params.resource,
      params.externalId,
    );
  }

  @Post(':resource/:externalId')
  @ApiZodBody(CreateCommentDto)
  create(
    @CurrentUser() user: CurrentUserPayload,
    @Param(new ZodValidationPipe(CommentResourceParamsDto))
    params: CommentResourceParams,
    @Body(new ZodValidationPipe(CreateCommentDto)) input: CreateCommentContract,
  ) {
    return this.comments.create(
      user.sub,
      params.resource,
      params.externalId,
      input,
    );
  }

  @Put(':commentId/rating')
  @ApiZodBody(RateCommentDto)
  rate(
    @CurrentUser() user: CurrentUserPayload,
    @Param(new ZodValidationPipe(RateCommentParamsDto))
    params: RateCommentParams,
    @Body(new ZodValidationPipe(RateCommentDto)) input: RateCommentContract,
  ) {
    return this.comments.rate(user.sub, params.commentId, input);
  }
}
