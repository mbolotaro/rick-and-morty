import { z } from 'zod';
import { createZodDto } from '../../../../common/validation/zod-dto.js';
import {
  CHARACTER_GENDER_VALUES,
  CHARACTER_SPECIES_VALUES,
  CHARACTER_STATUS_VALUES,
} from '../../domain/character-filter-values.js';

const page = z.coerce.number().int().positive().optional();

const charactersQuerySchema = z.object({
  page,
  name: z.string().trim().min(1).optional(),
  status: z.enum(CHARACTER_STATUS_VALUES).optional(),
  species: z.enum(CHARACTER_SPECIES_VALUES).optional(),
  type: z.string().trim().optional(),
  gender: z.enum(CHARACTER_GENDER_VALUES).optional(),
});

export class CharactersQueryDto extends createZodDto(charactersQuerySchema) {}
