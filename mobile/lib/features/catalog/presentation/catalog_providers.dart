import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pickle_verso/core/network/network_providers.dart';
import 'package:pickle_verso/features/catalog/data/catalog_api_service.dart';
import 'package:pickle_verso/features/catalog/data/catalog_repository_impl.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_models.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_queries.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_repository.dart';

final charactersRepositoryProvider = Provider<CharactersRepository>(
  (ref) => CharactersRepositoryImpl(
    CharactersApiService(ref.watch(authenticatedDioProvider)),
  ),
);

final episodesRepositoryProvider = Provider<EpisodesRepository>(
  (ref) => EpisodesRepositoryImpl(
    EpisodesApiService(ref.watch(authenticatedDioProvider)),
  ),
);

final locationsRepositoryProvider = Provider<LocationsRepository>(
  (ref) => LocationsRepositoryImpl(
    LocationsApiService(ref.watch(authenticatedDioProvider)),
  ),
);

final charactersPageProvider =
    FutureProvider.family<CatalogPage<Character>, CharactersQuery>(
      (ref, query) => ref.watch(charactersRepositoryProvider).list(query),
    );

final episodesPageProvider =
    FutureProvider.family<CatalogPage<Episode>, EpisodesQuery>(
      (ref, query) => ref.watch(episodesRepositoryProvider).list(query),
    );

final locationsPageProvider =
    FutureProvider.family<CatalogPage<Location>, LocationsQuery>(
      (ref, query) => ref.watch(locationsRepositoryProvider).list(query),
    );

final characterProfileProvider = FutureProvider.family<CharacterProfile, int>(
  (ref, id) => ref.watch(charactersRepositoryProvider).getProfile(id),
);

final episodeProvider = FutureProvider.family<Episode, int>(
  (ref, id) => ref.watch(episodesRepositoryProvider).getById(id),
);

final locationProvider = FutureProvider.family<Location, int>(
  (ref, id) => ref.watch(locationsRepositoryProvider).getById(id),
);
