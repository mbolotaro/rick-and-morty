import { Injectable } from '@nestjs/common';
import {
  currentLanguage,
  translate,
} from '../../../common/i18n/translate.js';
import type {
  Character,
  Episode,
  Location,
} from '../infrastructure/rick-and-morty.schemas.js';

const statusKeys: Record<string, string> = {
  alive: 'alive',
  dead: 'dead',
  unknown: 'unknown',
};

const genderKeys: Record<string, string> = {
  female: 'female',
  male: 'male',
  genderless: 'genderless',
  unknown: 'unknown',
};

const speciesKeys: Record<string, string> = {
  human: 'human',
  alien: 'alien',
  humanoid: 'humanoid',
  poopybutthole: 'poopybutthole',
  'mythological creature': 'mythologicalCreature',
  animal: 'animal',
  robot: 'robot',
  cronenberg: 'cronenberg',
  disease: 'disease',
  unknown: 'unknown',
};

const characterTypeKeys: Record<string, string> = {
  'genetic experiment': 'geneticExperiment',
  superhuman: 'superhuman',
  parasite: 'parasite',
  'human with antennae': 'humanWithAntennae',
  'human with ants in his eyes': 'humanWithAntsInEyes',
  'fish-person': 'fishPerson',
  'self-aware arm': 'selfAwareArm',
  'cat-person': 'catPerson',
  'microverse inhabitant': 'microverseInhabitant',
  'miniverse inhabitant': 'miniverseInhabitant',
  'light bulb-alien': 'lightBulbAlien',
  'larva alien': 'larvaAlien',
  demon: 'demon',
  giant: 'giant',
  hivemind: 'hivemind',
  'elephant-person': 'elephantPerson',
  'giant cat monster': 'giantCatMonster',
  'hairy alien': 'hairyAlien',
  pickle: 'pickle',
  bread: 'bread',
  rat: 'rat',
  'gear-person': 'gearPerson',
  'blue ape alien': 'blueApeAlien',
  'ring-nippled alien': 'ringNippledAlien',
  lizard: 'lizard',
  fly: 'fly',
  game: 'game',
  god: 'god',
  hole: 'hole',
  'self-aware simulation': 'selfAwareSimulation',
  robot: 'robot',
  vampire: 'vampire',
  cyborg: 'cyborg',
  animal: 'animal',
};

const locationTypeKeys: Record<string, string> = {
  planet: 'planet',
  cluster: 'cluster',
  'space station': 'spaceStation',
  microverse: 'microverse',
  tv: 'television',
  resort: 'resort',
  'fantasy town': 'fantasyTown',
  dream: 'dream',
  dimension: 'dimension',
  menagerie: 'menagerie',
  game: 'game',
  custom: 'custom',
  daycare: 'daycare',
  'dwarf planet (celestial dwarf)': 'dwarfPlanet',
  miniverse: 'miniverse',
  teenyverse: 'teenyverse',
  box: 'box',
  spacecraft: 'spacecraft',
  'artificially generated world': 'artificialWorld',
  machine: 'machine',
  arcade: 'arcade',
  spa: 'spa',
  quadrant: 'quadrant',
  quasar: 'quasar',
  mount: 'mount',
  liquid: 'liquid',
  convention: 'convention',
  woods: 'woods',
  diegesis: 'diegesis',
  'non-diegetic alternative reality': 'alternativeReality',
  'night jazz club': 'nightJazzClub',
  country: 'country',
  consciousness: 'consciousness',
  memory: 'memory',
  unknown: 'unknown',
};

const dimensionKeys: Record<string, string> = {
  'unknown dimension': 'unknown',
  unknown: 'unknown',
  'post-apocalyptic dimension': 'postApocalyptic',
  'replacement dimension': 'replacement',
  'fantasy dimension': 'fantasy',
  'testicle monster dimension': 'testicleMonster',
  'cromulon dimension': 'cromulon',
  'giant telepathic spiders dimension': 'giantSpiders',
  'pizza dimension': 'pizza',
  'phone dimension': 'phone',
  'chair dimension': 'chair',
  'fascist dimension': 'fascist',
  'fascist shrimp dimension': 'fascistShrimp',
  'fascist teddy bear dimension': 'fascistTeddyBear',
  'wasp dimension': 'wasp',
  'tusk dimension': 'tusk',
  'magic dimension': 'magic',
  'merged dimension': 'merged',
};

const monthIndexes: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

@Injectable()
export class CatalogLocalizerService {
  character(character: Character): Character {
    return {
      ...character,
      status: this.value('status', statusKeys, character.status),
      species: this.value('species', speciesKeys, character.species),
      type: this.value('characterType', characterTypeKeys, character.type),
      gender: this.value('gender', genderKeys, character.gender),
      origin: {
        ...character.origin,
        name: this.unknownName(character.origin.name),
      },
      location: {
        ...character.location,
        name: this.unknownName(character.location.name),
      },
    };
  }

  location(location: Location): Location {
    return {
      ...location,
      type: this.value('locationType', locationTypeKeys, location.type),
      dimension: this.dimension(location.dimension),
    };
  }

  episode(episode: Episode): Episode {
    return {
      ...episode,
      air_date: this.date(episode.air_date),
    };
  }

  private value(
    group: string,
    keys: Record<string, string>,
    original: string,
  ): string {
    if (!original) return original;

    const key = keys[original.toLowerCase()];
    return key
      ? translate(`catalog.${group}.${key}`, original)
      : original;
  }

  private unknownName(name: string): string {
    return name.toLowerCase() === 'unknown'
      ? translate('catalog.status.unknown', name)
      : name;
  }

  private dimension(value: string): string {
    const key = dimensionKeys[value.toLowerCase()];
    if (key) return translate(`catalog.dimension.${key}`, value);

    const leading = /^Dimension (.+)$/i.exec(value)?.[1];
    if (leading)
      return translate('catalog.dimension.named', value, { name: leading });

    const trailing = /^(.+) Dimension$/i.exec(value)?.[1];
    if (trailing)
      return translate('catalog.dimension.named', value, { name: trailing });

    return value;
  }

  private date(value: string): string {
    const match = /^([A-Za-z]+) (\d{1,2}), (\d{4})$/.exec(value);
    if (!match) return value;

    const month = monthIndexes[match[1]];
    if (month === undefined) return value;

    const date = new Date(
      Date.UTC(Number(match[3]), month, Number(match[2])),
    );

    return new Intl.DateTimeFormat(currentLanguage(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }
}
