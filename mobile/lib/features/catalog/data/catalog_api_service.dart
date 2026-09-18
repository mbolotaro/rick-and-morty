import 'package:dio/dio.dart';
import 'package:pickle_verso/core/network/api_exception.dart';
import 'package:pickle_verso/core/network/json_reader.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_models.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_queries.dart';

abstract class CatalogApiService<T, Q> {
  const CatalogApiService(this._client);

  Dio get client => _client;
  String get resource;
  T parseItem(JsonObject json);
  Map<String, Object?> queryParameters(Q query);

  final Dio _client;

  Future<CatalogPage<T>> list(Q query) async {
    try {
      final response = await _client.get<Object?>(
        '/$resource',
        queryParameters: queryParameters(query),
      );
      return CatalogPage.fromJson(JsonReader.object(response.data), parseItem);
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    } on FormatException {
      throw const ApiException('O catálogo retornou dados inválidos.');
    }
  }

  Future<T> getById(int id) async {
    try {
      final response = await _client.get<Object?>('/$resource/$id');
      return parseItem(JsonReader.object(response.data));
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    } on FormatException {
      throw const ApiException('O recurso retornou dados inválidos.');
    }
  }
}

class CharactersApiService
    extends CatalogApiService<Character, CharactersQuery> {
  const CharactersApiService(super.client);
  @override
  String get resource => 'characters';
  @override
  Character parseItem(JsonObject json) => Character.fromJson(json);

  @override
  Map<String, Object?> queryParameters(CharactersQuery query) =>
      <String, Object?>{
        'page': query.page,
        'name': query.name,
        'status': query.status?.apiValue,
        'species': query.species?.apiValue,
        'type': query.type,
        'gender': query.gender?.apiValue,
      }..removeWhere((_, value) => value == null || value == '');

  Future<CharacterProfile> getProfile(int id) async {
    try {
      final response = await client.get<Object?>('/characters/$id/profile');
      return CharacterProfile.fromJson(JsonReader.object(response.data));
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    } on FormatException {
      throw const ApiException('O perfil retornou dados inválidos.');
    }
  }
}

class EpisodesApiService extends CatalogApiService<Episode, EpisodesQuery> {
  const EpisodesApiService(super.client);
  @override
  String get resource => 'episodes';
  @override
  Episode parseItem(JsonObject json) => Episode.fromJson(json);

  @override
  Map<String, Object?> queryParameters(EpisodesQuery query) =>
      <String, Object?>{
        'page': query.page,
        'name': query.name,
        'episode': query.code,
      }..removeWhere((_, value) => value == null || value == '');
}

class LocationsApiService extends CatalogApiService<Location, LocationsQuery> {
  const LocationsApiService(super.client);
  @override
  String get resource => 'locations';
  @override
  Location parseItem(JsonObject json) => Location.fromJson(json);

  @override
  Map<String, Object?> queryParameters(LocationsQuery query) =>
      <String, Object?>{
        'page': query.page,
        'name': query.name,
        'type': query.type,
        'dimension': query.dimension,
      }..removeWhere((_, value) => value == null || value == '');
}
