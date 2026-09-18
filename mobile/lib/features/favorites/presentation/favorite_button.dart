import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pickle_verso/core/network/api_exception.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/favorites/presentation/favorite_providers.dart';
import 'package:pickle_verso/features/favorites/presentation/favorites_catalog_provider.dart';

class FavoriteButton extends ConsumerStatefulWidget {
  const FavoriteButton({required this.target, super.key});

  final CatalogTarget target;

  @override
  ConsumerState<FavoriteButton> createState() => _FavoriteButtonState();
}

class _FavoriteButtonState extends ConsumerState<FavoriteButton> {
  var _isSubmitting = false;

  Future<void> _toggle(bool current) async {
    setState(() => _isSubmitting = true);
    try {
      await ref
          .read(favoriteActionsProvider)
          .toggle(widget.target, current: current);
      ref.invalidate(favoriteStatusProvider(widget.target));
      ref.invalidate(favoriteCollectionProvider);
      ref.invalidate(favoritesCatalogProvider);
    } on ApiException catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(error.message)));
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final status = ref.watch(favoriteStatusProvider(widget.target));
    final liked = status.asData?.value ?? false;

    return FilledButton.tonalIcon(
      onPressed: status.isLoading || status.hasError || _isSubmitting
          ? null
          : () => _toggle(liked),
      icon: _isSubmitting
          ? const SizedBox.square(
              dimension: 18,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Icon(
              liked ? Icons.favorite_rounded : Icons.favorite_border_rounded,
            ),
      label: Text(liked ? 'Remover dos favoritos' : 'Adicionar aos favoritos'),
    );
  }
}
