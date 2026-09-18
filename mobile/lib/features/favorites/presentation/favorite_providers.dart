import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pickle_verso/core/network/network_providers.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/favorites/data/favorites_api_service.dart';
import 'package:pickle_verso/features/favorites/data/favorites_repository_impl.dart';
import 'package:pickle_verso/features/favorites/domain/favorites_repository.dart';

final favoritesRepositoryProvider = Provider<FavoritesRepository>(
  (ref) => FavoritesRepositoryImpl(
    FavoritesApiService(ref.watch(authenticatedDioProvider)),
  ),
);

final favoriteStatusProvider = FutureProvider.family<bool, CatalogTarget>(
  (ref, target) => ref.watch(favoritesRepositoryProvider).status(target),
);

final favoriteCollectionProvider = FutureProvider<FavoriteCollection>(
  (ref) => ref.watch(favoritesRepositoryProvider).list(),
);

final favoriteActionsProvider = Provider<FavoriteActions>(
  (ref) => FavoriteActions(ref.watch(favoritesRepositoryProvider)),
);

class FavoriteActions {
  const FavoriteActions(this._repository);

  final FavoritesRepository _repository;

  Future<bool> toggle(CatalogTarget target, {required bool current}) =>
      _repository.set(target, liked: !current);
}
