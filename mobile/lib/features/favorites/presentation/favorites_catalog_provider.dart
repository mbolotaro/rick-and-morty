import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_models.dart';
import 'package:pickle_verso/features/catalog/presentation/catalog_providers.dart';
import 'package:pickle_verso/features/favorites/presentation/favorite_providers.dart';

class FavoritesCatalog {
  const FavoritesCatalog({
    required this.characters,
    required this.episodes,
    required this.locations,
  });

  final List<Character> characters;
  final List<Episode> episodes;
  final List<Location> locations;

  bool get isEmpty =>
      characters.isEmpty && episodes.isEmpty && locations.isEmpty;
}

final favoritesCatalogProvider = FutureProvider<FavoritesCatalog>((ref) async {
  final collection = await ref.watch(favoriteCollectionProvider.future);
  final charactersRepository = ref.watch(charactersRepositoryProvider);
  final episodesRepository = ref.watch(episodesRepositoryProvider);
  final locationsRepository = ref.watch(locationsRepositoryProvider);

  final characters = Future.wait(
    collection.characters.map(charactersRepository.getById),
  );
  final episodes = Future.wait(
    collection.episodes.map(episodesRepository.getById),
  );
  final locations = Future.wait(
    collection.locations.map(locationsRepository.getById),
  );

  return FavoritesCatalog(
    characters: await characters,
    episodes: await episodes,
    locations: await locations,
  );
});
