import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/favorites/data/favorites_api_service.dart';
import 'package:pickle_verso/features/favorites/domain/favorites_repository.dart';

class FavoritesRepositoryImpl implements FavoritesRepository {
  const FavoritesRepositoryImpl(this._api);

  final FavoritesApiService _api;

  @override
  Future<FavoriteCollection> list() => _api.list();

  @override
  Future<bool> set(CatalogTarget target, {required bool liked}) =>
      _api.set(target, liked: liked);

  @override
  Future<bool> status(CatalogTarget target) => _api.status(target);
}
