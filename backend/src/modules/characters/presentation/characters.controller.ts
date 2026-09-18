import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe.js';
import { Public } from '../../auth/public.decorator.js';
import { CharactersService } from '../application/characters.service.js';
import {
  CharactersQuerySchema,
  type CharactersQuery,
} from './schemas/characters-query.schema.js';
import {
  CHARACTER_GENDER_VALUES,
  CHARACTER_SPECIES_VALUES,
  CHARACTER_STATUS_VALUES,
} from '../domain/character-filter-values.js';

@Public()
@ApiTags('characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly characters: CharactersService) {}
  @ApiQuery({ name: 'page', required: false, type: Number, minimum: 1 })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: CHARACTER_STATUS_VALUES })
  @ApiQuery({ name: 'species', required: false, enum: CHARACTER_SPECIES_VALUES })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'gender', required: false, enum: CHARACTER_GENDER_VALUES })
  @Get() list(
    @Query(new ZodValidationPipe(CharactersQuerySchema)) query: CharactersQuery,
  ) {
    return this.characters.list(query);
  }
  @ApiParam({ name: 'id', type: Number })
  @Get(':id/profile') getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.characters.getProfile(id);
  }
  @ApiParam({ name: 'id', type: Number })
  @Get(':id') getById(@Param('id', ParseIntPipe) id: number) {
    return this.characters.getById(id);
  }
}
