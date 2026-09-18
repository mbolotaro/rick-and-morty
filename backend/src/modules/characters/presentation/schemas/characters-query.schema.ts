import { z } from 'zod';
import {
  CHARACTER_GENDER_VALUES,
  CHARACTER_SPECIES_VALUES,
  CHARACTER_STATUS_VALUES,
} from '../../domain/character-filter-values.js';

const page = z.coerce.number().int().min(1).max(1000).optional();
export const CharactersQuerySchema = z.object({
  page,
  name: z.string().trim().min(1).optional(),
  status: z.enum(CHARACTER_STATUS_VALUES).optional(),
  species: z.enum(CHARACTER_SPECIES_VALUES).optional(),
  type: z.string().trim().optional(),
  gender: z.enum(CHARACTER_GENDER_VALUES).optional(),
});
export type CharactersQuery = z.infer<typeof CharactersQuerySchema>;
