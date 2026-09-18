import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'auth_session.dart';

class AuthRepository {
  AuthRepository({http.Client? client, FlutterSecureStorage? storage}) : _client = client ?? http.Client(), _storage = storage ?? const FlutterSecureStorage();
  final http.Client _client;
  final FlutterSecureStorage _storage;
  static const _accessKey = 'access_token';
  static const _refreshKey = 'refresh_token';
  static const baseUrl = String.fromEnvironment('API_URL', defaultValue: 'http://10.0.2.2:3001');

  Future<AuthSession> signIn(String email, String password) => _authenticate('/auth/mobile/sign-in', {'email': email, 'password': password});
  Future<AuthSession> signUp(String firstName, String lastName, String email, String password) => _authenticate('/auth/mobile/sign-up', {'firstName': firstName, 'lastName': lastName, 'email': email, 'password': password});

  Future<AuthSession> _authenticate(String path, Map<String, String> body) async {
    final response = await _client.post(Uri.parse('$baseUrl$path'), headers: {'content-type': 'application/json'}, body: jsonEncode(body));
    if (response.statusCode < 200 || response.statusCode >= 300) throw AuthException('Não foi possível autenticar.');
    final session = AuthSession.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    await _save(session);
    return session;
  }

  Future<String?> accessToken() => _storage.read(key: _accessKey);

  Future<String?> refresh() async {
    final token = await _storage.read(key: _refreshKey);
    if (token == null) return null;
    final response = await _client.post(Uri.parse('$baseUrl/auth/mobile/refresh'), headers: {'content-type': 'application/json'}, body: jsonEncode({'refreshToken': token}));
    if (response.statusCode < 200 || response.statusCode >= 300) { await clear(); return null; }
    final session = AuthSession.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
    await _save(session);
    return session.accessToken;
  }

  Future<http.Response> authorizedGet(String path) async {
    var token = await accessToken();
    var response = await _client.get(
      Uri.parse('$baseUrl$path'),
      headers: token == null ? null : {'authorization': 'Bearer $token'},
    );
    if (response.statusCode == 401 && (token = await refresh()) != null) response = await _client.get(Uri.parse('$baseUrl$path'), headers: {'authorization': 'Bearer $token'});
    return response;
  }

  Future<void> signOut() async { final token = await _storage.read(key: _refreshKey); if (token != null) await _client.post(Uri.parse('$baseUrl/auth/mobile/sign-out'), headers: {'content-type': 'application/json'}, body: jsonEncode({'refreshToken': token})); await clear(); }
  Future<void> _save(AuthSession session) async { await _storage.write(key: _accessKey, value: session.accessToken); await _storage.write(key: _refreshKey, value: session.refreshToken); }
  Future<void> clear() => _storage.deleteAll();
}

class AuthException implements Exception { AuthException(this.message); final String message; }
