import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { CurrentUser } from '../../auth/current-user.decorator.js';
import type { CurrentUserPayload } from '../../auth/current-user.decorator.js';
import { FavoritesService } from '../application/favorites.service.js';
import {
  FavoriteParamsSchema,
  type FavoriteParams,
} from './schemas/favorite-params.schema.js';

@ApiTags('favorites')
@ApiCookieAuth('access_token')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favorites: FavoritesService) {}

  @Get()
  list(@CurrentUser() user: CurrentUserPayload) {
    return this.favorites.list(user.sub);
  }

  @Get(':resource/:externalId')
  status(
    @CurrentUser() user: CurrentUserPayload,
    @Param(new ZodValidationPipe(FavoriteParamsSchema)) params: FavoriteParams,
  ) {
    return this.favorites.status(
      user.sub,
      params.resource,
      params.externalId,
    );
  }

  @Put(':resource/:externalId')
  add(
    @CurrentUser() user: CurrentUserPayload,
    @Param(new ZodValidationPipe(FavoriteParamsSchema)) params: FavoriteParams,
  ) {
    return this.favorites.add(user.sub, params.resource, params.externalId);
  }

  @Delete(':resource/:externalId')
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param(new ZodValidationPipe(FavoriteParamsSchema)) params: FavoriteParams,
  ) {
    return this.favorites.remove(user.sub, params.resource, params.externalId);
  }
}
