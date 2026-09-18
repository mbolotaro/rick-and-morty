import 'package:pickle_verso/features/auth/domain/auth_user.dart';

enum AuthStatus { checking, unauthenticated, authenticated }

class AuthState {
  const AuthState({
    required this.status,
    this.user,
    this.isSubmitting = false,
    this.errorMessage,
  });

  const AuthState.checking() : this(status: AuthStatus.checking);
  const AuthState.unauthenticated({String? errorMessage})
    : this(status: AuthStatus.unauthenticated, errorMessage: errorMessage);
  const AuthState.authenticated(AuthUser user)
    : this(status: AuthStatus.authenticated, user: user);

  final AuthStatus status;
  final AuthUser? user;
  final bool isSubmitting;
  final String? errorMessage;

  AuthState copyWith({
    bool? isSubmitting,
    String? errorMessage,
    bool clearError = false,
  }) {
    return AuthState(
      status: status,
      user: user,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
    );
  }
}
