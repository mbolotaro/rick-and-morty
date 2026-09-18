import { Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { CurrentUser } from '../../auth/presentation/decorators/current-user.decorator.js';
import type { CurrentUserPayload } from '../../auth/presentation/decorators/current-user.decorator.js';
import { FavoritesService } from '../application/favorites.service.js';
import type { FavoriteParamsContract } from '../application/contracts/favorite-resource.contract.js';
import {
  FavoriteParamsDto,
} from './dto/favorite-params.dto.js';

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
    @Param(new ZodValidationPipe(FavoriteParamsDto)) params: FavoriteParamsContract,
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
    @Param(new ZodValidationPipe(FavoriteParamsDto)) params: FavoriteParamsContract,
  ) {
    return this.favorites.add(user.sub, params.resource, params.externalId);
  }

  @Delete(':resource/:externalId')
  remove(
    @CurrentUser() user: CurrentUserPayload,
    @Param(new ZodValidationPipe(FavoriteParamsDto)) params: FavoriteParamsContract,
  ) {
    return this.favorites.remove(user.sub, params.resource, params.externalId);
  }
}
