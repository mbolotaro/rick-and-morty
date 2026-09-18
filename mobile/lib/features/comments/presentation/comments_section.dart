import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pickle_verso/core/network/api_exception.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';
import 'package:pickle_verso/features/catalog/domain/catalog_resource.dart';
import 'package:pickle_verso/features/comments/domain/comment.dart';
import 'package:pickle_verso/features/comments/presentation/comment_providers.dart';

class CommentsSection extends ConsumerWidget {
  const CommentsSection({required this.target, super.key});

  final CatalogTarget target;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final comments = ref.watch(commentsProvider(target));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                'Comentários',
                style: Theme.of(context).textTheme.titleLarge,
              ),
            ),
            if (comments case AsyncData(:final value))
              Text(
                '${value.length}',
                style: TextStyle(
                  color: context.colors.accent,
                  fontWeight: FontWeight.w900,
                ),
              ),
          ],
        ),
        const SizedBox(height: AppPrimitives.space3),
        _CommentComposer(target: target),
        const SizedBox(height: AppPrimitives.space4),
        comments.when(
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (error, _) => _CommentsError(
            message: error is ApiException
                ? error.message
                : 'Não foi possível carregar os comentários.',
            onRetry: () => ref.invalidate(commentsProvider(target)),
          ),
          data: (items) => items.isEmpty
              ? Text(
                  'Seja a primeira pessoa a comentar.',
                  style: TextStyle(color: context.colors.contentSecondary),
                )
              : Column(
                  children: [
                    for (final comment in items) ...[
                      _CommentCard(target: target, comment: comment),
                      const SizedBox(height: AppPrimitives.space3),
                    ],
                  ],
                ),
        ),
      ],
    );
  }
}

class _CommentComposer extends ConsumerStatefulWidget {
  const _CommentComposer({required this.target});

  final CatalogTarget target;

  @override
  ConsumerState<_CommentComposer> createState() => _CommentComposerState();
}

class _CommentComposerState extends ConsumerState<_CommentComposer> {
  final _controller = TextEditingController();
  var _isSubmitting = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_controller.text.trim().isEmpty) return;
    setState(() => _isSubmitting = true);
    try {
      await ref
          .read(commentActionsProvider)
          .create(widget.target, _controller.text);
      _controller.clear();
      ref.invalidate(commentsProvider(widget.target));
      if (mounted) FocusScope.of(context).unfocus();
    } on ApiException catch (error) {
      _showError(error.message);
    } on FormatException catch (error) {
      _showError(error.message);
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _showError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      TextField(
        controller: _controller,
        enabled: !_isSubmitting,
        minLines: 3,
        maxLines: 5,
        maxLength: commentMaxLength,
        textCapitalization: TextCapitalization.sentences,
        decoration: const InputDecoration(
          hintText: 'Compartilhe sua opinião sobre este registro...',
        ),
      ),
      Align(
        alignment: Alignment.centerRight,
        child: FilledButton.icon(
          onPressed: _isSubmitting ? null : _submit,
          icon: _isSubmitting
              ? const SizedBox.square(
                  dimension: 18,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : const Icon(Icons.send_rounded),
          label: const Text('Comentar'),
        ),
      ),
    ],
  );
}

class _CommentCard extends StatelessWidget {
  const _CommentCard({required this.target, required this.comment});

  final CatalogTarget target;
  final Comment comment;

  @override
  Widget build(BuildContext context) => Container(
    width: double.infinity,
    padding: const EdgeInsets.all(AppPrimitives.space3),
    decoration: BoxDecoration(
      color: context.colors.surface,
      borderRadius: BorderRadius.circular(AppPrimitives.radiusMedium),
      border: Border.all(color: context.colors.border),
    ),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CircleAvatar(
          backgroundColor: context.colors.accent.withValues(alpha: .18),
          child: Icon(Icons.person_rounded, color: context.colors.accent),
        ),
        const SizedBox(width: AppPrimitives.space3),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                comment.author.fullName,
                style: const TextStyle(fontWeight: FontWeight.w800),
              ),
              Text(
                _formatDate(comment.createdAt),
                style: TextStyle(
                  color: context.colors.contentSecondary,
                  fontSize: 12,
                ),
              ),
              const SizedBox(height: AppPrimitives.space2),
              Text(comment.content),
              const SizedBox(height: AppPrimitives.space2),
              Row(
                children: [
                  _RatingButton(
                    target: target,
                    comment: comment,
                    value: CommentRatingValue.up,
                  ),
                  const SizedBox(width: AppPrimitives.space2),
                  _RatingButton(
                    target: target,
                    comment: comment,
                    value: CommentRatingValue.down,
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class _RatingButton extends ConsumerStatefulWidget {
  const _RatingButton({
    required this.target,
    required this.comment,
    required this.value,
  });

  final CatalogTarget target;
  final Comment comment;
  final CommentRatingValue value;

  @override
  ConsumerState<_RatingButton> createState() => _RatingButtonState();
}

class _RatingButtonState extends ConsumerState<_RatingButton> {
  var _isSubmitting = false;

  Future<void> _rate() async {
    setState(() => _isSubmitting = true);
    try {
      await ref
          .read(commentActionsProvider)
          .rate(widget.comment.id, widget.value);
      ref.invalidate(commentsProvider(widget.target));
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
    final selected = widget.comment.rating.current == widget.value;
    final isUp = widget.value == CommentRatingValue.up;
    final count = isUp ? widget.comment.rating.up : widget.comment.rating.down;

    return TextButton.icon(
      onPressed: _isSubmitting ? null : _rate,
      style: TextButton.styleFrom(
        foregroundColor: selected ? context.colors.accent : null,
        backgroundColor: selected
            ? context.colors.accent.withValues(alpha: .14)
            : null,
      ),
      icon: Icon(isUp ? Icons.thumb_up_outlined : Icons.thumb_down_outlined),
      label: Text('$count'),
    );
  }
}

class _CommentsError extends StatelessWidget {
  const _CommentsError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) => Row(
    children: [
      Expanded(child: Text(message)),
      TextButton(onPressed: onRetry, child: const Text('Tentar novamente')),
    ],
  );
}

String _formatDate(DateTime value) {
  final local = value.toLocal();
  String twoDigits(int number) => number.toString().padLeft(2, '0');
  return '${twoDigits(local.day)}/${twoDigits(local.month)}/${local.year} '
      '${twoDigits(local.hour)}:${twoDigits(local.minute)}';
}
