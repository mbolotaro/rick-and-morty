import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { Public } from '../../auth/presentation/decorators/public.decorator.js';
import { LocationsService } from '../application/locations.service.js';
import type { LocationsQueryContract } from '../application/contracts/locations-query.contract.js';
import {
  LocationsQueryDto,
} from './dto/locations-query.dto.js';

@Public()
@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locations: LocationsService) {}
  @ApiQuery({ name: 'page', required: false, type: Number, minimum: 1 })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'dimension', required: false, type: String })
  @Get() list(
    @Query(new ZodValidationPipe(LocationsQueryDto)) query: LocationsQueryContract,
  ) {
    return this.locations.list(query);
  }
  @ApiParam({ name: 'id', type: Number })
  @Get(':id') getById(@Param('id', ParseIntPipe) id: number) {
    return this.locations.getById(id);
  }
}
