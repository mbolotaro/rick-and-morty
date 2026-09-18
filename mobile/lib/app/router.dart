import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pickle_verso/features/auth/presentation/auth_controller.dart';
import 'package:pickle_verso/features/auth/presentation/auth_state.dart';
import 'package:pickle_verso/features/auth/presentation/login_screen.dart';
import 'package:pickle_verso/features/auth/presentation/sign_up_screen.dart';
import 'package:pickle_verso/features/auth/presentation/splash_screen.dart';
import 'package:pickle_verso/features/catalog/presentation/home_screen.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/catalog/presentation/catalog_detail_screen.dart';

abstract final class AppRoutes {
  static const splash = '/splash';
  static const login = '/login';
  static const signUp = '/sign-up';
  static const home = '/';

  static String character(int id) => '/characters/$id';
  static String episode(int id) => '/episodes/$id';
  static String location(int id) => '/locations/$id';
}

final routerProvider = Provider<GoRouter>((ref) {
  final authStatus = ref.watch(
    authControllerProvider.select((state) => state.status),
  );

  final router = GoRouter(
    initialLocation: AppRoutes.splash,
    routes: [
      GoRoute(path: AppRoutes.splash, builder: (_, _) => const SplashScreen()),
      GoRoute(path: AppRoutes.login, builder: (_, _) => const LoginScreen()),
      GoRoute(path: AppRoutes.signUp, builder: (_, _) => const SignUpScreen()),
      GoRoute(path: AppRoutes.home, builder: (_, _) => const HomeScreen()),
      GoRoute(
        path: '/characters/:id',
        builder: (_, state) => CatalogDetailScreen(
          resource: CatalogResource.characters,
          externalId: int.parse(state.pathParameters['id']!),
        ),
      ),
      GoRoute(
        path: '/episodes/:id',
        builder: (_, state) => CatalogDetailScreen(
          resource: CatalogResource.episodes,
          externalId: int.parse(state.pathParameters['id']!),
        ),
      ),
      GoRoute(
        path: '/locations/:id',
        builder: (_, state) => CatalogDetailScreen(
          resource: CatalogResource.locations,
          externalId: int.parse(state.pathParameters['id']!),
        ),
      ),
    ],
    redirect: (_, state) {
      final location = state.matchedLocation;
      return switch (authStatus) {
        AuthStatus.checking =>
          location == AppRoutes.splash ? null : AppRoutes.splash,
        AuthStatus.unauthenticated =>
          location == AppRoutes.login || location == AppRoutes.signUp
              ? null
              : AppRoutes.login,
        AuthStatus.authenticated =>
          location == AppRoutes.login ||
                  location == AppRoutes.signUp ||
                  location == AppRoutes.splash
              ? AppRoutes.home
              : null,
      };
    },
  );
  ref.onDispose(router.dispose);
  return router;
});
