import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pickle_verso/core/network/api_exception.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_models.dart';

class CatalogSection<T> extends StatelessWidget {
  const CatalogSection({
    required this.title,
    required this.description,
    required this.page,
    required this.currentPage,
    required this.onPrevious,
    required this.onNext,
    required this.onRetry,
    required this.onFilter,
    required this.hasFilters,
    required this.cardBuilder,
    super.key,
  });

  final String title;
  final String description;
  final AsyncValue<CatalogPage<T>> page;
  final int currentPage;
  final VoidCallback onPrevious;
  final VoidCallback onNext;
  final VoidCallback onRetry;
  final VoidCallback onFilter;
  final bool hasFilters;
  final Widget Function(BuildContext context, T item) cardBuilder;

  @override
  Widget build(BuildContext context) {
    return page.when(
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (error, _) => _ErrorState(
        message: error is ApiException
            ? error.message
            : 'Não foi possível carregar o catálogo.',
        onRetry: onRetry,
      ),
      data: (data) => RefreshIndicator(
        onRefresh: () async => onRetry(),
        child: CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppPrimitives.space4,
                  AppPrimitives.space5,
                  AppPrimitives.space4,
                  AppPrimitives.space4,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            title,
                            style: Theme.of(context).textTheme.headlineSmall,
                          ),
                        ),
                        Badge(
                          isLabelVisible: hasFilters,
                          child: IconButton.filledTonal(
                            tooltip: 'Filtrar',
                            onPressed: onFilter,
                            icon: const Icon(Icons.tune_rounded),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppPrimitives.space1),
                    Text(
                      description,
                      style: TextStyle(color: context.colors.contentSecondary),
                    ),
                  ],
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppPrimitives.space4,
              ),
              sliver: SliverList.separated(
                itemCount: data.results.length,
                itemBuilder: (context, index) =>
                    cardBuilder(context, data.results[index]),
                separatorBuilder: (_, _) =>
                    const SizedBox(height: AppPrimitives.space3),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(
                  AppPrimitives.space4,
                  AppPrimitives.space4,
                  AppPrimitives.space4,
                  AppPrimitives.space6,
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: data.info.previous == null
                            ? null
                            : onPrevious,
                        icon: const Icon(Icons.arrow_back_rounded),
                        label: const Text('Anterior'),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppPrimitives.space3,
                      ),
                      child: Text(
                        '$currentPage / ${data.info.pages}',
                        style: const TextStyle(fontWeight: FontWeight.w800),
                      ),
                    ),
                    Expanded(
                      child: FilledButton.icon(
                        onPressed: data.info.next == null ? null : onNext,
                        iconAlignment: IconAlignment.end,
                        icon: const Icon(Icons.arrow_forward_rounded),
                        label: const Text('Próxima'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Center(
    child: Padding(
      padding: const EdgeInsets.all(AppPrimitives.space5),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.auto_awesome_rounded,
            size: 64,
            color: context.colors.accent,
          ),
          const SizedBox(height: AppPrimitives.space3),
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: AppPrimitives.space4),
          FilledButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh),
            label: const Text('Tentar novamente'),
          ),
        ],
      ),
    ),
  );
}
