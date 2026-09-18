import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_queries.dart';

final catalogControllerProvider =
    NotifierProvider<CatalogController, CatalogViewState>(
      CatalogController.new,
    );

class CatalogViewState {
  const CatalogViewState({
    this.selectedIndex = 0,
    this.characters = initialCharactersQuery,
    this.episodes = initialEpisodesQuery,
    this.locations = initialLocationsQuery,
  });

  final int selectedIndex;
  final CharactersQuery characters;
  final EpisodesQuery episodes;
  final LocationsQuery locations;

  int get currentPage => switch (selectedIndex) {
    0 => characters.page,
    1 => episodes.page,
    _ => locations.page,
  };

  bool get hasCurrentFilters => switch (selectedIndex) {
    0 =>
      characters.name != null ||
          characters.status != null ||
          characters.species != null ||
          characters.type != null ||
          characters.gender != null,
    1 => episodes.name != null || episodes.code != null,
    _ =>
      locations.name != null ||
          locations.type != null ||
          locations.dimension != null,
  };

  CatalogViewState copyWith({
    int? selectedIndex,
    CharactersQuery? characters,
    EpisodesQuery? episodes,
    LocationsQuery? locations,
  }) => CatalogViewState(
    selectedIndex: selectedIndex ?? this.selectedIndex,
    characters: characters ?? this.characters,
    episodes: episodes ?? this.episodes,
    locations: locations ?? this.locations,
  );
}

class CatalogController extends Notifier<CatalogViewState> {
  @override
  CatalogViewState build() => const CatalogViewState();

  void selectSection(int index) => state = state.copyWith(selectedIndex: index);

  void changePage(int delta) {
    switch (state.selectedIndex) {
      case 0:
        final query = state.characters;
        state = state.copyWith(
          characters: (
            page: query.page + delta,
            name: query.name,
            status: query.status,
            species: query.species,
            type: query.type,
            gender: query.gender,
          ),
        );
      case 1:
        final query = state.episodes;
        state = state.copyWith(
          episodes: (
            page: query.page + delta,
            name: query.name,
            code: query.code,
          ),
        );
      default:
        final query = state.locations;
        state = state.copyWith(
          locations: (
            page: query.page + delta,
            name: query.name,
            type: query.type,
            dimension: query.dimension,
          ),
        );
    }
  }

  void applyCharacters(CharactersQuery query) => state = state.copyWith(
    characters: (
      page: 1,
      name: _normalized(query.name),
      status: query.status,
      species: query.species,
      type: _normalized(query.type),
      gender: query.gender,
    ),
  );

  void applyEpisodes(EpisodesQuery query) => state = state.copyWith(
    episodes: (
      page: 1,
      name: _normalized(query.name),
      code: _normalized(query.code),
    ),
  );

  void applyLocations(LocationsQuery query) => state = state.copyWith(
    locations: (
      page: 1,
      name: _normalized(query.name),
      type: _normalized(query.type),
      dimension: _normalized(query.dimension),
    ),
  );

  void clearCurrentFilters() {
    state = switch (state.selectedIndex) {
      0 => state.copyWith(characters: initialCharactersQuery),
      1 => state.copyWith(episodes: initialEpisodesQuery),
      _ => state.copyWith(locations: initialLocationsQuery),
    };
  }

  String? _normalized(String? value) {
    final normalized = value?.trim();
    return normalized == null || normalized.isEmpty ? null : normalized;
  }
}
