import 'package:pickle_verso/features/auth/domain/auth_user.dart';

abstract interface class AuthRepository {
  Future<AuthUser?> restoreSession();
  Future<AuthUser> signIn({required String email, required String password});
  Future<AuthUser> signUp({
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  });
  Future<void> signOut();
}
