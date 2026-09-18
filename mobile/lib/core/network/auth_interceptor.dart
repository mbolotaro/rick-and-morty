import 'dart:async';

import 'package:dio/dio.dart';
import 'package:pickle_verso/core/network/json_reader.dart';
import 'package:pickle_verso/core/network/token_store.dart';

class AuthInterceptor extends QueuedInterceptor {
  AuthInterceptor(this._client, this._refreshClient, this._tokens);

  static const _retriedKey = 'auth-retried';

  final Dio _client;
  final Dio _refreshClient;
  final TokenStore _tokens;
  Future<String?>? _refreshing;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final accessToken = _tokens.accessToken;
    if (accessToken != null) {
      options.headers['Authorization'] = 'Bearer $accessToken';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final request = err.requestOptions;
    final shouldRefresh =
        err.response?.statusCode == 401 && request.extra[_retriedKey] != true;
    if (!shouldRefresh) return handler.next(err);

    final currentAccessToken = _tokens.accessToken;
    final failedAuthorization = request.headers['Authorization'];
    if (currentAccessToken != null &&
        failedAuthorization != 'Bearer $currentAccessToken') {
      return _retry(request, currentAccessToken, handler);
    }

    final accessToken = await (_refreshing ??= _refreshAccessToken());
    _refreshing = null;
    if (accessToken == null) return handler.next(err);

    return _retry(request, accessToken, handler);
  }

  Future<void> _retry(
    RequestOptions request,
    String accessToken,
    ErrorInterceptorHandler handler,
  ) async {
    try {
      request.extra[_retriedKey] = true;
      request.headers['Authorization'] = 'Bearer $accessToken';
      handler.resolve(await _client.fetch<Object?>(request));
    } on DioException catch (retryError) {
      handler.next(retryError);
    }
  }

  Future<String?> _refreshAccessToken() async {
    try {
      final refreshToken = await _tokens.readRefreshToken();
      if (refreshToken == null) return null;
      final response = await _refreshClient.post<Object?>(
        '/auth/mobile/refresh',
        data: <String, Object?>{'refreshToken': refreshToken},
      );
      final json = JsonReader.object(response.data);
      final accessToken = JsonReader.string(json, 'accessToken');
      final rotatedRefreshToken = JsonReader.string(json, 'refreshToken');
      await _tokens.save(
        accessToken: accessToken,
        refreshToken: rotatedRefreshToken,
      );
      return accessToken;
    } on Exception {
      await _tokens.clear(notifyExpiration: true);
      return null;
    }
  }
}
