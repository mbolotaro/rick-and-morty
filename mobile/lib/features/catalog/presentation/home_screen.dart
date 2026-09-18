import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pickle_verso/app/router.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';
import 'package:pickle_verso/core/ui/app_background.dart';
import 'package:pickle_verso/features/auth/presentation/auth_controller.dart';
import 'package:pickle_verso/features/catalog/presentation/catalog_cards.dart';
import 'package:pickle_verso/features/catalog/presentation/catalog_controller.dart';
import 'package:pickle_verso/features/catalog/presentation/catalog_filters_sheet.dart';
import 'package:pickle_verso/features/catalog/presentation/catalog_providers.dart';
import 'package:pickle_verso/features/catalog/presentation/catalog_section.dart';
import 'package:pickle_verso/features/favorites/presentation/favorites_section.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authControllerProvider).user;
    final catalog = ref.watch(catalogControllerProvider);

    return Scaffold(
      extendBody: true,
      body: AppBackground(
        child: SafeArea(
          bottom: false,
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppPrimitives.space4,
                  AppPrimitives.space3,
                  AppPrimitives.space2,
                  0,
                ),
                child: Row(
                  children: [
                    Image.asset('assets/images/pickle-rick.webp', height: 52),
                    const SizedBox(width: AppPrimitives.space2),
                    const Expanded(
                      child: Text(
                        'PICKLEVERSE',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 2,
                        ),
                      ),
                    ),
                    Text(
                      user?.firstName ?? '',
                      style: TextStyle(
                        color: context.colors.contentSecondary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    IconButton(
                      tooltip: 'Sair',
                      onPressed: () =>
                          ref.read(authControllerProvider.notifier).signOut(),
                      icon: const Icon(Icons.logout_rounded),
                    ),
                  ],
                ),
              ),
              Expanded(child: _buildSelectedCatalog(context, ref, catalog)),
              const SizedBox(height: 74),
            ],
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: catalog.selectedIndex,
        onDestinationSelected: ref
            .read(catalogControllerProvider.notifier)
            .selectSection,
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.people_outline_rounded),
            selectedIcon: Icon(Icons.people_rounded),
            label: 'Personagens',
          ),
          NavigationDestination(
            icon: Icon(Icons.play_circle_outline_rounded),
            selectedIcon: Icon(Icons.play_circle_fill_rounded),
            label: 'Episódios',
          ),
          NavigationDestination(
            icon: Icon(Icons.public_outlined),
            selectedIcon: Icon(Icons.public_rounded),
            label: 'Localidades',
          ),
          NavigationDestination(
            icon: Icon(Icons.favorite_border_rounded),
            selectedIcon: Icon(Icons.favorite_rounded),
            label: 'Favoritos',
          ),
        ],
      ),
    );
  }

  Widget _buildSelectedCatalog(
    BuildContext context,
    WidgetRef ref,
    CatalogViewState state,
  ) {
    final controller = ref.read(catalogControllerProvider.notifier);
    switch (state.selectedIndex) {
      case 0:
        return CatalogSection(
          title: 'Personagens',
          description: 'Conheça quem atravessa todas essas realidades.',
          page: ref.watch(charactersPageProvider(state.characters)),
          currentPage: state.characters.page,
          onPrevious: () => controller.changePage(-1),
          onNext: () => controller.changePage(1),
          onRetry: () =>
              ref.invalidate(charactersPageProvider(state.characters)),
          onFilter: () => showCatalogFilters(context, state),
          hasFilters: state.hasCurrentFilters,
          cardBuilder: (_, character) => CharacterCard(
            character: character,
            onTap: () => context.push(AppRoutes.character(character.id)),
          ),
        );
      case 1:
        return CatalogSection(
          title: 'Episódios',
          description: 'Todas as aventuras do multiverso em ordem.',
          page: ref.watch(episodesPageProvider(state.episodes)),
          currentPage: state.episodes.page,
          onPrevious: () => controller.changePage(-1),
          onNext: () => controller.changePage(1),
          onRetry: () => ref.invalidate(episodesPageProvider(state.episodes)),
          onFilter: () => showCatalogFilters(context, state),
          hasFilters: state.hasCurrentFilters,
          cardBuilder: (_, episode) => EpisodeCard(
            episode: episode,
            onTap: () => context.push(AppRoutes.episode(episode.id)),
          ),
        );
      case 2:
        return CatalogSection(
          title: 'Localidades',
          description: 'Planetas, dimensões e lugares nada convencionais.',
          page: ref.watch(locationsPageProvider(state.locations)),
          currentPage: state.locations.page,
          onPrevious: () => controller.changePage(-1),
          onNext: () => controller.changePage(1),
          onRetry: () => ref.invalidate(locationsPageProvider(state.locations)),
          onFilter: () => showCatalogFilters(context, state),
          hasFilters: state.hasCurrentFilters,
          cardBuilder: (_, location) => LocationCard(
            location: location,
            onTap: () => context.push(AppRoutes.location(location.id)),
          ),
        );
      default:
        return const FavoritesSection();
    }
  }
}
