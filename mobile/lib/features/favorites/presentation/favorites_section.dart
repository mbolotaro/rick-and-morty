import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pickle_verso/app/router.dart';
import 'package:pickle_verso/core/network/api_exception.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';
import 'package:pickle_verso/features/catalog/presentation/catalog_cards.dart';
import 'package:pickle_verso/features/favorites/presentation/favorite_providers.dart';
import 'package:pickle_verso/features/favorites/presentation/favorites_catalog_provider.dart';

class FavoritesSection extends ConsumerWidget {
  const FavoritesSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final favorites = ref.watch(favoritesCatalogProvider);

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(favoriteCollectionProvider);
        ref.invalidate(favoritesCatalogProvider);
        await ref.read(favoritesCatalogProvider.future);
      },
      child: favorites.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, _) => ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          children: [
            SizedBox(height: MediaQuery.sizeOf(context).height * .2),
            Icon(
              Icons.heart_broken_rounded,
              size: 56,
              color: context.colors.accent,
            ),
            const SizedBox(height: AppPrimitives.space3),
            Text(
              error is ApiException
                  ? error.message
                  : 'Não foi possível carregar seus favoritos.',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppPrimitives.space3),
            Center(
              child: FilledButton.icon(
                onPressed: () {
                  ref.invalidate(favoriteCollectionProvider);
                  ref.invalidate(favoritesCatalogProvider);
                },
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Tentar novamente'),
              ),
            ),
          ],
        ),
        data: (data) => ListView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(
            AppPrimitives.space4,
            AppPrimitives.space5,
            AppPrimitives.space4,
            AppPrimitives.space5,
          ),
          children: [
            Text('Favoritos', style: Theme.of(context).textTheme.headlineSmall),
            const SizedBox(height: AppPrimitives.space1),
            Text(
              'Os registros que você guardou entre as realidades.',
              style: TextStyle(color: context.colors.contentSecondary),
            ),
            const SizedBox(height: AppPrimitives.space4),
            if (data.isEmpty)
              const _EmptyFavorites()
            else ...[
              if (data.characters.isNotEmpty) ...[
                const _SectionTitle('Personagens'),
                for (final character in data.characters) ...[
                  CharacterCard(
                    character: character,
                    onTap: () =>
                        context.push(AppRoutes.character(character.id)),
                  ),
                  const SizedBox(height: AppPrimitives.space3),
                ],
              ],
              if (data.episodes.isNotEmpty) ...[
                const _SectionTitle('Episódios'),
                for (final episode in data.episodes) ...[
                  EpisodeCard(
                    episode: episode,
                    onTap: () => context.push(AppRoutes.episode(episode.id)),
                  ),
                  const SizedBox(height: AppPrimitives.space3),
                ],
              ],
              if (data.locations.isNotEmpty) ...[
                const _SectionTitle('Localidades'),
                for (final location in data.locations) ...[
                  LocationCard(
                    location: location,
                    onTap: () => context.push(AppRoutes.location(location.id)),
                  ),
                  const SizedBox(height: AppPrimitives.space3),
                ],
              ],
            ],
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.label);

  final String label;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(
      top: AppPrimitives.space3,
      bottom: AppPrimitives.space3,
    ),
    child: Text(label, style: Theme.of(context).textTheme.titleLarge),
  );
}

class _EmptyFavorites extends StatelessWidget {
  const _EmptyFavorites();

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.symmetric(vertical: AppPrimitives.space6),
    child: Column(
      children: [
        Icon(
          Icons.favorite_border_rounded,
          size: 64,
          color: context.colors.accent,
        ),
        const SizedBox(height: AppPrimitives.space3),
        Text(
          'Você ainda não adicionou nenhum favorito.',
          textAlign: TextAlign.center,
          style: TextStyle(color: context.colors.contentSecondary),
        ),
      ],
    ),
  );
}
