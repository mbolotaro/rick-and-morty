import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pickle_verso/core/network/api_exception.dart';
import 'package:pickle_verso/core/network/network_providers.dart';
import 'package:pickle_verso/features/auth/data/auth_api_service.dart';
import 'package:pickle_verso/features/auth/data/auth_repository_impl.dart';
import 'package:pickle_verso/features/auth/domain/auth_repository.dart';
import 'package:pickle_verso/features/auth/domain/auth_user.dart';
import 'package:pickle_verso/features/auth/presentation/auth_state.dart';

final authApiServiceProvider = Provider<AuthApiService>(
  (ref) => AuthApiService(ref.watch(publicDioProvider)),
);

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepositoryImpl(
    ref.watch(authApiServiceProvider),
    ref.watch(tokenStoreProvider),
  ),
);

final authControllerProvider = NotifierProvider<AuthController, AuthState>(
  AuthController.new,
);

class AuthController extends Notifier<AuthState> {
  @override
  AuthState build() {
    final subscription = ref.watch(tokenStoreProvider).sessionExpired.listen((
      _,
    ) {
      state = const AuthState.unauthenticated(
        errorMessage: 'Sua sessão expirou. Entre novamente.',
      );
    });
    ref.onDispose(subscription.cancel);
    unawaited(_restore());
    return const AuthState.checking();
  }

  Future<void> _restore() async {
    final user = await ref.read(authRepositoryProvider).restoreSession();
    state = user == null
        ? const AuthState.unauthenticated()
        : AuthState.authenticated(user);
  }

  Future<bool> signIn({required String email, required String password}) async {
    return _authenticate(
      () => ref
          .read(authRepositoryProvider)
          .signIn(email: email, password: password),
    );
  }

  Future<bool> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    return _authenticate(
      () => ref
          .read(authRepositoryProvider)
          .signUp(
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
          ),
    );
  }

  Future<bool> _authenticate(Future<AuthUser> Function() request) async {
    state = state.copyWith(isSubmitting: true, clearError: true);
    try {
      final user = await request();
      state = AuthState.authenticated(user);
      return true;
    } on ApiException catch (error) {
      state = AuthState.unauthenticated(errorMessage: error.message)
          .copyWith(isSubmitting: false);
      return false;
    } on Exception {
      state = const AuthState.unauthenticated(
        errorMessage: 'Não foi possível salvar sua sessão neste dispositivo.',
      );
      return false;
    }
  }

  Future<void> signOut() async {
    await ref.read(authRepositoryProvider).signOut();
    state = const AuthState.unauthenticated();
  }

  void clearError() => state = state.copyWith(clearError: true);
}
