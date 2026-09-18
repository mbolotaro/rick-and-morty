import 'package:pickle_verso/core/network/json_reader.dart';

const commentMaxLength = 1000;

enum CommentRatingValue {
  up('UP'),
  down('DOWN');

  const CommentRatingValue(this.apiValue);

  final String apiValue;

  static CommentRatingValue? fromNullableJson(Object? value) {
    if (value == null) return null;
    return switch (value) {
      'UP' => CommentRatingValue.up,
      'DOWN' => CommentRatingValue.down,
      _ => throw const FormatException('current possui um valor inválido.'),
    };
  }
}

class CommentAuthor {
  const CommentAuthor({
    required this.id,
    required this.firstName,
    required this.lastName,
  });

  factory CommentAuthor.fromJson(JsonObject json) => CommentAuthor(
    id: JsonReader.string(json, 'id'),
    firstName: JsonReader.string(json, 'firstName'),
    lastName: JsonReader.string(json, 'lastName'),
  );

  final String id;
  final String firstName;
  final String lastName;

  String get fullName => '$firstName $lastName'.trim();
}

class CommentRating {
  const CommentRating({
    required this.up,
    required this.down,
    required this.current,
  });

  factory CommentRating.fromJson(JsonObject json) => CommentRating(
    up: JsonReader.integer(json, 'up'),
    down: JsonReader.integer(json, 'down'),
    current: CommentRatingValue.fromNullableJson(json['current']),
  );

  final int up;
  final int down;
  final CommentRatingValue? current;
}

class Comment {
  const Comment({
    required this.id,
    required this.content,
    required this.createdAt,
    required this.author,
    required this.rating,
  });

  factory Comment.fromJson(JsonObject json) {
    final createdAtValue = JsonReader.string(json, 'createdAt');
    final createdAt = DateTime.tryParse(createdAtValue);
    if (createdAt == null) {
      throw const FormatException('createdAt deve ser uma data válida.');
    }

    final content = JsonReader.string(json, 'content');
    if (content.isEmpty || content.length > commentMaxLength) {
      throw const FormatException('content possui tamanho inválido.');
    }

    return Comment(
      id: JsonReader.string(json, 'id'),
      content: content,
      createdAt: createdAt,
      author: CommentAuthor.fromJson(
        JsonReader.object(json['author'], 'author'),
      ),
      rating: CommentRating.fromJson(
        JsonReader.object(json['rating'], 'rating'),
      ),
    );
  }

  final String id;
  final String content;
  final DateTime createdAt;
  final CommentAuthor author;
  final CommentRating rating;
}
