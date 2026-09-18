import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/comments/domain/comment.dart';

abstract interface class CommentsRepository {
  Future<List<Comment>> list(CatalogTarget target);
  Future<Comment> create(CatalogTarget target, String content);
  Future<CommentRating> rate(String commentId, CommentRatingValue value);
}
