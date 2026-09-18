import type {
  CatalogPage,
  CatalogQuery,
  Character,
  Episode,
  Location,
} from '../contracts/catalog.models.js';

export abstract class CatalogGateway {
  abstract getCharactersPage(query: CatalogQuery): Promise<CatalogPage<Character>>;
  abstract getCharacter(id: number): Promise<Character>;
  abstract getResource(
    resource: 'characters' | 'locations' | 'episodes',
    id: number,
  ): Promise<Character | Location | Episode>;
  abstract getEpisodesPage(query: CatalogQuery): Promise<CatalogPage<Episode>>;
  abstract getEpisode(id: number): Promise<Episode>;
  abstract getEpisodes(ids: number[]): Promise<Episode[]>;
  abstract getLocationsPage(query: CatalogQuery): Promise<CatalogPage<Location>>;
  abstract getLocation(id: number): Promise<Location>;
  abstract getLocations(ids: number[]): Promise<Location[]>;
}
