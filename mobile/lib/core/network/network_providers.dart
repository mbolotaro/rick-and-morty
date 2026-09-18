import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:pickle_verso/core/config/app_config.dart';
import 'package:pickle_verso/core/network/auth_interceptor.dart';
import 'package:pickle_verso/core/network/token_store.dart';
import 'package:pickle_verso/core/storage/secure_key_value_store.dart';

BaseOptions _baseOptions() => BaseOptions(
  baseUrl: AppConfig.apiBaseUrl,
  connectTimeout: AppConfig.requestTimeout,
  receiveTimeout: AppConfig.requestTimeout,
  sendTimeout: AppConfig.requestTimeout,
  headers: const {'Accept': 'application/json', 'Accept-Language': 'pt-BR'},
);

final secureStorageProvider = Provider<FlutterSecureStorage>(
  (ref) => const FlutterSecureStorage(),
);

final secureKeyValueStoreProvider = Provider<SecureKeyValueStore>(
  (ref) => FlutterSecureKeyValueStore(ref.watch(secureStorageProvider)),
);

final tokenStoreProvider = Provider<TokenStore>((ref) {
  final store = TokenStore(ref.watch(secureKeyValueStoreProvider));
  ref.onDispose(store.dispose);
  return store;
});

final publicDioProvider = Provider<Dio>((ref) => Dio(_baseOptions()));

final authenticatedDioProvider = Provider<Dio>((ref) {
  final client = Dio(_baseOptions());
  client.interceptors.add(
    AuthInterceptor(
      client,
      ref.watch(publicDioProvider),
      ref.watch(tokenStoreProvider),
    ),
  );
  return client;
});
