import type {
  Character,
  Episode,
  Location,
} from '../../src/modules/rick-and-morty/application/contracts/catalog.models.js';

export const characterFixture: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [
    'https://rickandmortyapi.com/api/episode/1',
    'https://rickandmortyapi.com/api/episode/2',
  ],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

export const episodeFixture: Episode = {
  id: 1,
  name: 'Pilot',
  air_date: 'December 2, 2013',
  episode: 'S01E01',
  characters: ['https://rickandmortyapi.com/api/character/1'],
  url: 'https://rickandmortyapi.com/api/episode/1',
  created: '2017-11-10T12:56:33.798Z',
};

export const locationFixture: Location = {
  id: 1,
  name: 'Earth (C-137)',
  type: 'Planet',
  dimension: 'Dimension C-137',
  residents: ['https://rickandmortyapi.com/api/character/38'],
  url: 'https://rickandmortyapi.com/api/location/1',
  created: '2017-11-10T12:42:04.162Z',
};
