import 'package:pickle_verso/features/catalog/data/catalog_api_service.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_models.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_queries.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_repository.dart';

class CatalogRepositoryImpl<T, Q> implements CatalogRepository<T, Q> {
  const CatalogRepositoryImpl(this._api);

  final CatalogApiService<T, Q> _api;

  @override
  Future<T> getById(int id) => _api.getById(id);

  @override
  Future<CatalogPage<T>> list(Q query) => _api.list(query);
}

class CharactersRepositoryImpl
    extends CatalogRepositoryImpl<Character, CharactersQuery>
    implements CharactersRepository {
  CharactersRepositoryImpl(this._charactersApi) : super(_charactersApi);

  final CharactersApiService _charactersApi;

  @override
  Future<CharacterProfile> getProfile(int id) => _charactersApi.getProfile(id);
}

class EpisodesRepositoryImpl
    extends CatalogRepositoryImpl<Episode, EpisodesQuery>
    implements EpisodesRepository {
  EpisodesRepositoryImpl(EpisodesApiService super.api);
}

class LocationsRepositoryImpl
    extends CatalogRepositoryImpl<Location, LocationsQuery>
    implements LocationsRepository {
  LocationsRepositoryImpl(LocationsApiService super.api);
}
