import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pickle_verso/core/network/network_providers.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/comments/data/comments_api_service.dart';
import 'package:pickle_verso/features/comments/data/comments_repository_impl.dart';
import 'package:pickle_verso/features/comments/domain/comment.dart';
import 'package:pickle_verso/features/comments/domain/comments_repository.dart';

final commentsRepositoryProvider = Provider<CommentsRepository>(
  (ref) => CommentsRepositoryImpl(
    CommentsApiService(ref.watch(authenticatedDioProvider)),
  ),
);

final commentsProvider = FutureProvider.family<List<Comment>, CatalogTarget>(
  (ref, target) => ref.watch(commentsRepositoryProvider).list(target),
);

final commentActionsProvider = Provider<CommentActions>(
  (ref) => CommentActions(ref.watch(commentsRepositoryProvider)),
);

class CommentActions {
  const CommentActions(this._repository);

  final CommentsRepository _repository;

  Future<Comment> create(CatalogTarget target, String rawContent) {
    final content = rawContent.trim();
    if (content.isEmpty || content.length > commentMaxLength) {
      throw const FormatException(
        'O comentário deve ter entre 1 e 1000 caracteres.',
      );
    }
    return _repository.create(target, content);
  }

  Future<CommentRating> rate(String commentId, CommentRatingValue value) =>
      _repository.rate(commentId, value);
}
