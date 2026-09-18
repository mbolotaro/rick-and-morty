import 'package:dio/dio.dart';
import 'package:pickle_verso/core/network/api_exception.dart';
import 'package:pickle_verso/core/network/json_reader.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/comments/domain/comment.dart';

class CommentsApiService {
  const CommentsApiService(this._client);

  final Dio _client;

  Future<List<Comment>> list(CatalogTarget target) async {
    try {
      final response = await _client.get<Object?>(_path(target));
      return JsonReader.list(response.data)
          .map(
            (item) => Comment.fromJson(JsonReader.object(item, 'comments[]')),
          )
          .toList(growable: false);
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    } on FormatException {
      throw const ApiException('O servidor retornou comentários inválidos.');
    }
  }

  Future<Comment> create(CatalogTarget target, String content) async {
    try {
      final response = await _client.post<Object?>(
        _path(target),
        data: <String, Object?>{'content': content},
      );
      return Comment.fromJson(JsonReader.object(response.data));
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    } on FormatException {
      throw const ApiException('O servidor retornou um comentário inválido.');
    }
  }

  Future<CommentRating> rate(String commentId, CommentRatingValue value) async {
    try {
      final response = await _client.put<Object?>(
        '/comments/$commentId/rating',
        data: <String, Object?>{'value': value.apiValue},
      );
      return CommentRating.fromJson(JsonReader.object(response.data));
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    } on FormatException {
      throw const ApiException(
        'O servidor retornou uma avaliação inválida.',
      );
    }
  }

  String _path(CatalogTarget target) =>
      '/comments/${target.resource.path}/${target.externalId}';
}
