import 'package:flutter/material.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';

class CartoonCard extends StatelessWidget {
  const CartoonCard({
    required this.child,
    this.onTap,
    this.padding = const EdgeInsets.all(AppPrimitives.space3),
    super.key,
  });

  final Widget child;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      color: context.colors.surface,
      borderRadius: BorderRadius.circular(AppPrimitives.radiusMedium),
      border: Border.all(color: context.colors.border, width: 1.5),
      boxShadow: const [
        BoxShadow(color: AppPrimitives.ink950, offset: Offset(3, 4)),
      ],
    ),
    child: Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(AppPrimitives.radiusMedium),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(padding: padding, child: child),
      ),
    ),
  );
}
