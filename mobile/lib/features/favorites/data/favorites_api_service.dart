import 'package:dio/dio.dart';
import 'package:pickle_verso/core/network/api_exception.dart';
import 'package:pickle_verso/core/network/json_reader.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/favorites/domain/favorites_repository.dart';

class FavoritesApiService {
  const FavoritesApiService(this._client);

  final Dio _client;

  Future<FavoriteCollection> list() async {
    try {
      final response = await _client.get<Object?>('/favorites');
      final json = JsonReader.object(response.data);
      return FavoriteCollection(
        characters: _ids(json, 'characters'),
        episodes: _ids(json, 'episodes'),
        locations: _ids(json, 'locations'),
      );
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    } on FormatException {
      throw const ApiException('O servidor retornou favoritos inválidos.');
    }
  }

  Future<bool> status(CatalogTarget target) =>
      _request(target, () => _client.get<Object?>(_path(target)));

  Future<bool> set(CatalogTarget target, {required bool liked}) => _request(
    target,
    () => liked
        ? _client.put<Object?>(_path(target))
        : _client.delete<Object?>(_path(target)),
  );

  Future<bool> _request(
    CatalogTarget target,
    Future<Response<Object?>> Function() request,
  ) async {
    try {
      final response = await request();
      return JsonReader.boolean(JsonReader.object(response.data), 'liked');
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    } on FormatException {
      throw const ApiException('O servidor retornou um favorito inválido.');
    }
  }

  String _path(CatalogTarget target) =>
      '/favorites/${target.resource.path}/${target.externalId}';

  List<int> _ids(JsonObject json, String key) => JsonReader.list(json[key], key)
      .map((value) {
        if (value is int && value > 0) return value;
        throw FormatException('$key deve conter identificadores positivos.');
      })
      .toList(growable: false);
}
