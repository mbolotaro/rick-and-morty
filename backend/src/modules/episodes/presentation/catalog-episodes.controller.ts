import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { Public } from '../../auth/public.decorator.js';
import { CatalogEpisodesService } from '../application/catalog-episodes.service.js';
import {
  EpisodesQuerySchema,
  type EpisodesQuery,
} from './schemas/episodes-query.schema.js';
@Public()
@ApiTags('episodes')
@Controller('episodes')
export class CatalogEpisodesController {
  constructor(private readonly episodes: CatalogEpisodesService) {}
  @ApiQuery({ name: 'page', required: false, type: Number, minimum: 1 })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'episode', required: false, type: String, example: 'S01E01' })
  @Get() list(
    @Query(new ZodValidationPipe(EpisodesQuerySchema)) query: EpisodesQuery,
  ) {
    return this.episodes.list(query);
  }
  @ApiParam({ name: 'id', type: Number })
  @Get(':id') getById(@Param('id', ParseIntPipe) id: number) {
    return this.episodes.getById(id);
  }
}
