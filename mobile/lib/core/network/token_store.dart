import 'dart:async';

import 'package:pickle_verso/core/storage/secure_key_value_store.dart';

class TokenStore {
  TokenStore(this._storage);

  static const _refreshTokenKey = 'refresh_token';

  final SecureKeyValueStore _storage;
  final _sessionExpired = StreamController<void>.broadcast();
  String? _accessToken;

  String? get accessToken => _accessToken;
  Stream<void> get sessionExpired => _sessionExpired.stream;

  Future<String?> readRefreshToken() => _storage.read(_refreshTokenKey);

  Future<void> save({
    required String accessToken,
    required String refreshToken,
  }) async {
    _accessToken = accessToken;
    await _storage.write(_refreshTokenKey, refreshToken);
  }

  Future<void> clear({bool notifyExpiration = false}) async {
    _accessToken = null;
    await _storage.delete(_refreshTokenKey);
    if (notifyExpiration) _sessionExpired.add(null);
  }

  Future<void> dispose() => _sessionExpired.close();
}
