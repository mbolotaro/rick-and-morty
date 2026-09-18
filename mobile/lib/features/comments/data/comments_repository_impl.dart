import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/comments/data/comments_api_service.dart';
import 'package:pickle_verso/features/comments/domain/comment.dart';
import 'package:pickle_verso/features/comments/domain/comments_repository.dart';

class CommentsRepositoryImpl implements CommentsRepository {
  const CommentsRepositoryImpl(this._api);

  final CommentsApiService _api;

  @override
  Future<Comment> create(CatalogTarget target, String content) =>
      _api.create(target, content);

  @override
  Future<List<Comment>> list(CatalogTarget target) => _api.list(target);

  @override
  Future<CommentRating> rate(String commentId, CommentRatingValue value) =>
      _api.rate(commentId, value);
}
