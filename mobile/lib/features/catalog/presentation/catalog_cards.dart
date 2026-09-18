import 'package:flutter/material.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';
import 'package:pickle_verso/core/ui/cartoon_card.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_models.dart';

class CharacterCard extends StatelessWidget {
  const CharacterCard({required this.character, this.onTap, super.key});
  final Character character;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => CartoonCard(
    onTap: onTap,
    child: Row(
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(AppPrimitives.radiusSmall),
          child: Image.network(
            character.image,
            width: 104,
            height: 118,
            fit: BoxFit.cover,
            errorBuilder: (_, _, _) => const SizedBox(
              width: 104,
              height: 118,
              child: Icon(Icons.person, size: 54),
            ),
          ),
        ),
        const SizedBox(width: AppPrimitives.space4),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                character.name,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: AppPrimitives.space2),
              Wrap(
                spacing: AppPrimitives.space2,
                runSpacing: AppPrimitives.space2,
                children: [
                  _Tag(character.status, color: context.colors.accent),
                  _Tag(character.species),
                  _Tag(character.gender),
                ],
              ),
              const SizedBox(height: AppPrimitives.space3),
              Text(
                character.location.name,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(color: context.colors.contentSecondary),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class EpisodeCard extends StatelessWidget {
  const EpisodeCard({required this.episode, this.onTap, super.key});
  final Episode episode;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => CartoonCard(
    onTap: onTap,
    child: ListTile(
      contentPadding: EdgeInsets.zero,
      leading: _IconTile(
        icon: Icons.play_arrow_rounded,
        color: context.colors.accent,
      ),
      title: Text(episode.name, style: Theme.of(context).textTheme.titleMedium),
      subtitle: Text(episode.airDate),
      trailing: _Tag(episode.code, color: context.colors.accentSecondary),
    ),
  );
}

class LocationCard extends StatelessWidget {
  const LocationCard({required this.location, this.onTap, super.key});
  final Location location;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) => CartoonCard(
    onTap: onTap,
    child: ListTile(
      contentPadding: EdgeInsets.zero,
      leading: _IconTile(
        icon: Icons.public_rounded,
        color: context.colors.accentSecondary,
      ),
      title: Text(
        location.name,
        style: Theme.of(context).textTheme.titleMedium,
      ),
      subtitle: Text('${location.type} • ${location.dimension}'),
      trailing: Text(
        '${location.residentCount}',
        style: const TextStyle(fontWeight: FontWeight.w900),
      ),
    ),
  );
}

class _Tag extends StatelessWidget {
  const _Tag(this.label, {this.color});
  final String label;
  final Color? color;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
    decoration: BoxDecoration(
      color: (color ?? context.colors.contentSecondary).withValues(alpha: .14),
      borderRadius: BorderRadius.circular(999),
      border: Border.all(color: color ?? context.colors.border),
    ),
    child: Text(
      label,
      style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
    ),
  );
}

class _IconTile extends StatelessWidget {
  const _IconTile({required this.icon, required this.color});
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) => Container(
    width: 46,
    height: 46,
    decoration: BoxDecoration(
      color: color.withValues(alpha: .18),
      shape: BoxShape.circle,
    ),
    child: Icon(icon, color: color),
  );
}
