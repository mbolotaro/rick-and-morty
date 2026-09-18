export type FilterName =
  | 'name'
  | 'status'
  | 'species'
  | 'gender'
  | 'type'
  | 'dimension'
  | 'episode';

export interface FilterOption {
  value: string;
  label: string;
}

const options: Partial<Record<FilterName, readonly FilterOption[]>> = {
  status: [
    { value: 'alive', label: 'filterOptions.alive' },
    { value: 'dead', label: 'filterOptions.dead' },
    { value: 'unknown', label: 'filterOptions.unknown' },
  ],
  species: [
    { value: 'human', label: 'filterOptions.human' },
    { value: 'alien', label: 'filterOptions.alien' },
    { value: 'humanoid', label: 'filterOptions.humanoid' },
    { value: 'poopybutthole', label: 'filterOptions.poopybutthole' },
    { value: 'mythological creature', label: 'filterOptions.mythologicalCreature' },
    { value: 'animal', label: 'filterOptions.animal' },
    { value: 'robot', label: 'filterOptions.robot' },
    { value: 'cronenberg', label: 'filterOptions.cronenberg' },
    { value: 'disease', label: 'filterOptions.disease' },
    { value: 'unknown', label: 'filterOptions.unknown' },
  ],
  gender: [
    { value: 'female', label: 'filterOptions.female' },
    { value: 'male', label: 'filterOptions.male' },
    { value: 'genderless', label: 'filterOptions.genderless' },
    { value: 'unknown', label: 'filterOptions.unknown' },
  ],
};

export function getFilterOptions(
  filter: FilterName,
): readonly FilterOption[] | null {
  return options[filter] ?? null;
}
