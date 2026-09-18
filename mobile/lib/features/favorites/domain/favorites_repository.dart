import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';

class FavoriteCollection {
  const FavoriteCollection({
    required this.characters,
    required this.episodes,
    required this.locations,
  });

  final List<int> characters;
  final List<int> episodes;
  final List<int> locations;

  bool get isEmpty =>
      characters.isEmpty && episodes.isEmpty && locations.isEmpty;
}

abstract interface class FavoritesRepository {
  Future<FavoriteCollection> list();
  Future<bool> status(CatalogTarget target);
  Future<bool> set(CatalogTarget target, {required bool liked});
}
