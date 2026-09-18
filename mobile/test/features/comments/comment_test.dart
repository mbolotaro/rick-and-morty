import 'package:flutter_test/flutter_test.dart';
import 'package:pickle_verso/features/comments/domain/comment.dart';

void main() {
  Map<String, Object?> validComment() => <String, Object?>{
    'id': 'comment-1',
    'content': 'Wubba lubba dub dub',
    'createdAt': '2026-01-01T12:00:00.000Z',
    'author': <String, Object?>{
      'id': 'user-1',
      'firstName': 'Rick',
      'lastName': 'Sanchez',
    },
    'rating': <String, Object?>{'up': 2, 'down': 1, 'current': 'UP'},
  };

  test('parses a typed comment with the current rating', () {
    final comment = Comment.fromJson(validComment());

    expect(comment.author.fullName, 'Rick Sanchez');
    expect(comment.rating.current, CommentRatingValue.up);
    expect(comment.createdAt.isUtc, isTrue);
  });

  test('rejects comments larger than the backend limit', () {
    final json = validComment()..['content'] = 'a' * (commentMaxLength + 1);

    expect(() => Comment.fromJson(json), throwsFormatException);
  });

  test('rejects an unsupported rating value', () {
    final json = validComment();
    json['rating'] = <String, Object?>{'up': 0, 'down': 0, 'current': 'MAYBE'};

    expect(() => Comment.fromJson(json), throwsFormatException);
  });
}
