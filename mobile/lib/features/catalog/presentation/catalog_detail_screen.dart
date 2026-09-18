import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pickle_verso/app/router.dart';
import 'package:pickle_verso/core/network/api_exception.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';
import 'package:pickle_verso/core/ui/app_background.dart';
import 'package:pickle_verso/core/ui/cartoon_card.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_models.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/catalog/presentation/catalog_providers.dart';
import 'package:pickle_verso/features/comments/presentation/comments_section.dart';
import 'package:pickle_verso/features/favorites/presentation/favorite_button.dart';

class CatalogDetailScreen extends ConsumerWidget {
  const CatalogDetailScreen({
    required this.resource,
    required this.externalId,
    super.key,
  });

  final CatalogResource resource;
  final int externalId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final content = switch (resource) {
      CatalogResource.characters => _AsyncDetail<CharacterProfile>(
        value: ref.watch(characterProfileProvider(externalId)),
        onRetry: () => ref.invalidate(characterProfileProvider(externalId)),
        builder: (profile) => _CharacterDetail(profile: profile),
      ),
      CatalogResource.episodes => _AsyncDetail<Episode>(
        value: ref.watch(episodeProvider(externalId)),
        onRetry: () => ref.invalidate(episodeProvider(externalId)),
        builder: (episode) => _EpisodeDetail(episode: episode),
      ),
      CatalogResource.locations => _AsyncDetail<Location>(
        value: ref.watch(locationProvider(externalId)),
        onRetry: () => ref.invalidate(locationProvider(externalId)),
        builder: (location) => _LocationDetail(location: location),
      ),
    };

    return Scaffold(
      body: AppBackground(
        child: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: AppPrimitives.space2,
                ),
                child: Row(
                  children: [
                    IconButton(
                      tooltip: 'Voltar',
                      onPressed: context.pop,
                      icon: const Icon(Icons.arrow_back_rounded),
                    ),
                    const SizedBox(width: AppPrimitives.space2),
                    Text(
                      'Registro #$externalId',
                      style: Theme.of(context).textTheme.titleMedium,
                    ),
                  ],
                ),
              ),
              Expanded(child: content),
            ],
          ),
        ),
      ),
    );
  }
}

class _AsyncDetail<T> extends StatelessWidget {
  const _AsyncDetail({
    required this.value,
    required this.onRetry,
    required this.builder,
  });

  final AsyncValue<T> value;
  final VoidCallback onRetry;
  final Widget Function(T value) builder;

  @override
  Widget build(BuildContext context) => value.when(
    loading: () => const Center(child: CircularProgressIndicator()),
    error: (error, _) => Center(
      child: Padding(
        padding: const EdgeInsets.all(AppPrimitives.space5),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.auto_awesome_rounded,
              color: context.colors.accent,
              size: 56,
            ),
            const SizedBox(height: AppPrimitives.space3),
            Text(
              error is ApiException
                  ? error.message
                  : 'Não foi possível carregar este registro.',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppPrimitives.space3),
            FilledButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Tentar novamente'),
            ),
          ],
        ),
      ),
    ),
    data: builder,
  );
}

class _CharacterDetail extends StatelessWidget {
  const _CharacterDetail({required this.profile});

  final CharacterProfile profile;

  @override
  Widget build(BuildContext context) {
    final character = profile.character;
    return _DetailScrollView(
      target: (resource: CatalogResource.characters, externalId: character.id),
      header: CartoonCard(
        padding: EdgeInsets.zero,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            AspectRatio(
              aspectRatio: 1.45,
              child: Image.network(character.image, fit: BoxFit.cover),
            ),
            Padding(
              padding: const EdgeInsets.all(AppPrimitives.space4),
              child: _ResourceSummary(
                name: character.name,
                details: [
                  ('Status', character.status),
                  ('Espécie', character.species),
                  ('Gênero', character.gender),
                  (
                    'Tipo',
                    character.type.isEmpty ? 'Não informado' : character.type,
                  ),
                  ('Origem', character.origin.name),
                  ('Local atual', character.location.name),
                ],
              ),
            ),
          ],
        ),
      ),
      relations: _CharacterRelations(profile: profile),
    );
  }
}

class _EpisodeDetail extends StatelessWidget {
  const _EpisodeDetail({required this.episode});

  final Episode episode;

  @override
  Widget build(BuildContext context) => _DetailScrollView(
    target: (resource: CatalogResource.episodes, externalId: episode.id),
    header: CartoonCard(
      child: _ResourceSummary(
        name: episode.name,
        icon: Icons.play_circle_fill_rounded,
        details: [
          ('Código', episode.code),
          ('Exibição', episode.airDate),
          ('Personagens', '${episode.characterCount}'),
        ],
      ),
    ),
  );
}

class _LocationDetail extends StatelessWidget {
  const _LocationDetail({required this.location});

  final Location location;

  @override
  Widget build(BuildContext context) => _DetailScrollView(
    target: (resource: CatalogResource.locations, externalId: location.id),
    header: CartoonCard(
      child: _ResourceSummary(
        name: location.name,
        icon: Icons.public_rounded,
        details: [
          ('Tipo', location.type),
          ('Dimensão', location.dimension),
          ('Residentes', '${location.residentCount}'),
        ],
      ),
    ),
  );
}

class _DetailScrollView extends StatelessWidget {
  const _DetailScrollView({
    required this.target,
    required this.header,
    this.relations,
  });

  final CatalogTarget target;
  final Widget header;
  final Widget? relations;

  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.fromLTRB(
      AppPrimitives.space4,
      AppPrimitives.space3,
      AppPrimitives.space4,
      AppPrimitives.space6,
    ),
    children: [
      header,
      const SizedBox(height: AppPrimitives.space4),
      Align(
        alignment: Alignment.centerLeft,
        child: FavoriteButton(target: target),
      ),
      if (relations != null) ...[
        const SizedBox(height: AppPrimitives.space5),
        relations!,
      ],
      const SizedBox(height: AppPrimitives.space5),
      CommentsSection(target: target),
    ],
  );
}

class _ResourceSummary extends StatelessWidget {
  const _ResourceSummary({
    required this.name,
    required this.details,
    this.icon,
  });

  final String name;
  final IconData? icon;
  final List<(String, String)> details;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Row(
        children: [
          if (icon != null) ...[
            Icon(icon, color: context.colors.accent, size: 34),
            const SizedBox(width: AppPrimitives.space3),
          ],
          Expanded(
            child: Text(name, style: Theme.of(context).textTheme.headlineSmall),
          ),
        ],
      ),
      const SizedBox(height: AppPrimitives.space4),
      for (final (label, value) in details)
        Padding(
          padding: const EdgeInsets.only(bottom: AppPrimitives.space2),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 104,
                child: Text(
                  label,
                  style: TextStyle(color: context.colors.contentSecondary),
                ),
              ),
              Expanded(
                child: Text(
                  value,
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
        ),
    ],
  );
}

class _CharacterRelations extends StatelessWidget {
  const _CharacterRelations({required this.profile});

  final CharacterProfile profile;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      _RelationList(
        title: 'Episódios',
        items: profile.episodes
            .map(
              (episode) => _RelationItem(
                title: episode.name,
                subtitle: '${episode.code} • ${episode.airDate}',
                icon: Icons.play_arrow_rounded,
                onTap: () => context.push(AppRoutes.episode(episode.id)),
              ),
            )
            .toList(growable: false),
      ),
      const SizedBox(height: AppPrimitives.space5),
      _RelationList(
        title: 'Localidades',
        items: profile.locations
            .map(
              (location) => _RelationItem(
                title: location.name,
                subtitle: '${location.type} • ${location.dimension}',
                icon: Icons.public_rounded,
                onTap: () => context.push(AppRoutes.location(location.id)),
              ),
            )
            .toList(growable: false),
      ),
    ],
  );
}

class _RelationList extends StatelessWidget {
  const _RelationList({required this.title, required this.items});

  final String title;
  final List<_RelationItem> items;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        '$title (${items.length})',
        style: Theme.of(context).textTheme.titleLarge,
      ),
      const SizedBox(height: AppPrimitives.space3),
      SizedBox(
        height: 138,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          itemCount: items.length,
          separatorBuilder: (_, _) =>
              const SizedBox(width: AppPrimitives.space3),
          itemBuilder: (_, index) => items[index],
        ),
      ),
    ],
  );
}

class _RelationItem extends StatelessWidget {
  const _RelationItem({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => SizedBox(
    width: 230,
    child: CartoonCard(
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: context.colors.accent),
          const Spacer(),
          Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: AppPrimitives.space1),
          Text(
            subtitle,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: context.colors.contentSecondary,
              fontSize: 12,
            ),
          ),
        ],
      ),
    ),
  );
}
