import 'package:flutter_test/flutter_test.dart';
import 'package:pickle_verso/core/network/token_store.dart';
import 'package:pickle_verso/core/storage/secure_key_value_store.dart';

class MemorySecureStore implements SecureKeyValueStore {
  final values = <String, String>{};

  @override
  Future<void> delete(String key) async => values.remove(key);

  @override
  Future<String?> read(String key) async => values[key];

  @override
  Future<void> write(String key, String value) async => values[key] = value;
}

void main() {
  test(
    'keeps access token in memory and refresh token in secure storage',
    () async {
      final secureStore = MemorySecureStore();
      final tokens = TokenStore(secureStore);

      await tokens.save(accessToken: 'access', refreshToken: 'refresh');

      expect(tokens.accessToken, 'access');
      expect(await tokens.readRefreshToken(), 'refresh');
      await tokens.dispose();
    },
  );

  test('clears both tokens and announces an expired session', () async {
    final tokens = TokenStore(MemorySecureStore());
    await tokens.save(accessToken: 'access', refreshToken: 'refresh');
    final expiration = expectLater(tokens.sessionExpired, emits(null));

    await tokens.clear(notifyExpiration: true);

    expect(tokens.accessToken, isNull);
    expect(await tokens.readRefreshToken(), isNull);
    await expiration;
    await tokens.dispose();
  });
}
