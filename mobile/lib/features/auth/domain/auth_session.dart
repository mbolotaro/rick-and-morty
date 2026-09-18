import 'package:pickle_verso/core/network/json_reader.dart';
import 'package:pickle_verso/features/auth/domain/auth_user.dart';

class AuthSession {
  const AuthSession({
    required this.user,
    required this.accessToken,
    required this.refreshToken,
  });

  factory AuthSession.fromJson(JsonObject json) => AuthSession(
    user: AuthUser.fromJson(JsonReader.object(json['user'], 'user')),
    accessToken: JsonReader.string(json, 'accessToken'),
    refreshToken: JsonReader.string(json, 'refreshToken'),
  );

  final AuthUser user;
  final String accessToken;
  final String refreshToken;
}
