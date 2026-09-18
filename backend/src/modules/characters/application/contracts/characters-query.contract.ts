import type {
  CHARACTER_GENDER_VALUES,
  CHARACTER_SPECIES_VALUES,
  CHARACTER_STATUS_VALUES,
} from '../../domain/character-filter-values.js';

export interface CharactersQueryContract extends Record<string, string | number | undefined> {
  page?: number;
  name?: string;
  status?: (typeof CHARACTER_STATUS_VALUES)[number];
  species?: (typeof CHARACTER_SPECIES_VALUES)[number];
  type?: string;
  gender?: (typeof CHARACTER_GENDER_VALUES)[number];
}
