import 'package:pickle_verso/core/network/json_reader.dart';

class PageInfo {
  const PageInfo({
    required this.count,
    required this.pages,
    this.next,
    this.previous,
  });

  factory PageInfo.fromJson(JsonObject json) => PageInfo(
    count: JsonReader.integer(json, 'count'),
    pages: JsonReader.integer(json, 'pages'),
    next: JsonReader.nullableString(json, 'next'),
    previous: JsonReader.nullableString(json, 'prev'),
  );

  final int count;
  final int pages;
  final String? next;
  final String? previous;
}

class CatalogPage<T> {
  const CatalogPage({required this.info, required this.results});

  factory CatalogPage.fromJson(JsonObject json, T Function(JsonObject) parser) {
    return CatalogPage(
      info: PageInfo.fromJson(JsonReader.object(json['info'], 'info')),
      results: JsonReader.list(json['results'], 'results')
          .map((item) => parser(JsonReader.object(item, 'results[]')))
          .toList(growable: false),
    );
  }

  final PageInfo info;
  final List<T> results;
}

class CatalogReference {
  const CatalogReference({required this.name, required this.url});

  factory CatalogReference.fromJson(JsonObject json) => CatalogReference(
    name: JsonReader.string(json, 'name'),
    url: JsonReader.string(json, 'url'),
  );

  final String name;
  final String url;
}

class Character {
  const Character({
    required this.id,
    required this.name,
    required this.status,
    required this.species,
    required this.type,
    required this.gender,
    required this.origin,
    required this.location,
    required this.image,
    required this.episodes,
  });

  factory Character.fromJson(JsonObject json) => Character(
    id: JsonReader.integer(json, 'id'),
    name: JsonReader.string(json, 'name'),
    status: JsonReader.string(json, 'status'),
    species: JsonReader.string(json, 'species'),
    type: JsonReader.string(json, 'type'),
    gender: JsonReader.string(json, 'gender'),
    origin: CatalogReference.fromJson(
      JsonReader.object(json['origin'], 'origin'),
    ),
    location: CatalogReference.fromJson(
      JsonReader.object(json['location'], 'location'),
    ),
    image: JsonReader.string(json, 'image'),
    episodes: JsonReader.list(json['episode'], 'episode')
        .map((value) {
          if (value is String) return value;
          throw const FormatException('episode[] deve ser uma string.');
        })
        .toList(growable: false),
  );

  final int id;
  final String name;
  final String status;
  final String species;
  final String type;
  final String gender;
  final CatalogReference origin;
  final CatalogReference location;
  final String image;
  final List<String> episodes;
}

class Episode {
  const Episode({
    required this.id,
    required this.name,
    required this.airDate,
    required this.code,
    required this.characters,
  });

  factory Episode.fromJson(JsonObject json) => Episode(
    id: JsonReader.integer(json, 'id'),
    name: JsonReader.string(json, 'name'),
    airDate: JsonReader.string(json, 'air_date'),
    code: JsonReader.string(json, 'episode'),
    characters: JsonReader.list(json['characters'], 'characters')
        .map((value) {
          if (value is String) return value;
          throw const FormatException('characters[] deve ser uma string.');
        })
        .toList(growable: false),
  );

  final int id;
  final String name;
  final String airDate;
  final String code;
  final List<String> characters;

  int get characterCount => characters.length;
}

class Location {
  const Location({
    required this.id,
    required this.name,
    required this.type,
    required this.dimension,
    required this.residents,
  });

  factory Location.fromJson(JsonObject json) => Location(
    id: JsonReader.integer(json, 'id'),
    name: JsonReader.string(json, 'name'),
    type: JsonReader.string(json, 'type'),
    dimension: JsonReader.string(json, 'dimension'),
    residents: JsonReader.list(json['residents'], 'residents')
        .map((value) {
          if (value is String) return value;
          throw const FormatException('residents[] deve ser uma string.');
        })
        .toList(growable: false),
  );

  final int id;
  final String name;
  final String type;
  final String dimension;
  final List<String> residents;

  int get residentCount => residents.length;
}

class CharacterProfile {
  const CharacterProfile({
    required this.character,
    required this.episodes,
    required this.locations,
  });

  factory CharacterProfile.fromJson(JsonObject json) => CharacterProfile(
    character: Character.fromJson(
      JsonReader.object(json['character'], 'character'),
    ),
    episodes: JsonReader.list(json['episodes'], 'episodes')
        .map(
          (value) => Episode.fromJson(JsonReader.object(value, 'episodes[]')),
        )
        .toList(growable: false),
    locations: JsonReader.list(json['locations'], 'locations')
        .map(
          (value) => Location.fromJson(JsonReader.object(value, 'locations[]')),
        )
        .toList(growable: false),
  );

  final Character character;
  final List<Episode> episodes;
  final List<Location> locations;
}
