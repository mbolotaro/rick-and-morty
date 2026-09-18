import 'package:pickle_verso/core/network/token_store.dart';
import 'package:pickle_verso/features/auth/data/auth_api_service.dart';
import 'package:pickle_verso/features/auth/domain/auth_repository.dart';
import 'package:pickle_verso/features/auth/domain/auth_session.dart';
import 'package:pickle_verso/features/auth/domain/auth_user.dart';

class AuthRepositoryImpl implements AuthRepository {
  const AuthRepositoryImpl(this._api, this._tokens);

  final AuthApiService _api;
  final TokenStore _tokens;

  @override
  Future<AuthUser?> restoreSession() async {
    final refreshToken = await _tokens.readRefreshToken();
    if (refreshToken == null) return null;
    try {
      return await _save(await _api.refresh(refreshToken));
    } on Exception {
      await _tokens.clear();
      return null;
    }
  }

  @override
  Future<AuthUser> signIn({
    required String email,
    required String password,
  }) async {
    return _save(await _api.signIn(email: email, password: password));
  }

  @override
  Future<AuthUser> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    return _save(
      await _api.signUp(
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      ),
    );
  }

  @override
  Future<void> signOut() async {
    final refreshToken = await _tokens.readRefreshToken();
    try {
      if (refreshToken != null) await _api.signOut(refreshToken);
    } on Exception {
      // Local logout remains available when the server cannot be reached.
    } finally {
      await _tokens.clear();
    }
  }

  Future<AuthUser> _save(AuthSession session) async {
    await _tokens.save(
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    );
    return session.user;
  }
}
