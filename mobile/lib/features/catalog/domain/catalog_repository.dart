import 'package:pickle_verso/features/catalog/domain/catalog_models.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_queries.dart';

abstract interface class CatalogRepository<T, Q> {
  Future<CatalogPage<T>> list(Q query);
  Future<T> getById(int id);
}

abstract interface class CharactersRepository
    implements CatalogRepository<Character, CharactersQuery> {
  Future<CharacterProfile> getProfile(int id);
}

abstract interface class EpisodesRepository
    implements CatalogRepository<Episode, EpisodesQuery> {}

abstract interface class LocationsRepository
    implements CatalogRepository<Location, LocationsQuery> {}
