import 'package:dio/dio.dart';
import 'package:pickle_verso/core/network/api_exception.dart';
import 'package:pickle_verso/core/network/json_reader.dart';
import 'package:pickle_verso/features/auth/domain/auth_session.dart';

class AuthApiService {
  const AuthApiService(this._client);

  final Dio _client;

  Future<AuthSession> signIn({
    required String email,
    required String password,
  }) {
    return _requestSession('/auth/mobile/sign-in', <String, Object?>{
      'email': email.trim().toLowerCase(),
      'password': password,
    });
  }

  Future<AuthSession> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) {
    return _requestSession('/auth/mobile/sign-up', <String, Object?>{
      'firstName': firstName.trim(),
      'lastName': lastName.trim(),
      'email': email.trim().toLowerCase(),
      'password': password,
    });
  }

  Future<AuthSession> refresh(String refreshToken) {
    return _requestSession('/auth/mobile/refresh', <String, Object?>{
      'refreshToken': refreshToken,
    });
  }

  Future<void> signOut(String refreshToken) async {
    try {
      await _client.post<void>(
        '/auth/mobile/sign-out',
        data: <String, Object?>{'refreshToken': refreshToken},
      );
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    }
  }

  Future<AuthSession> _requestSession(String path, JsonObject body) async {
    try {
      final response = await _client.post<Object?>(path, data: body);
      return AuthSession.fromJson(JsonReader.object(response.data));
    } on DioException catch (error) {
      throw ApiException.fromDio(error);
    } on FormatException {
      throw const ApiException('O servidor retornou uma resposta inválida.');
    }
  }
}
