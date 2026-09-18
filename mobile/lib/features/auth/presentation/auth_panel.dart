import 'package:flutter/material.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';

class AuthPanel extends StatelessWidget {
  const AuthPanel({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.all(AppPrimitives.space5),
    decoration: BoxDecoration(
      color: context.colors.surface,
      borderRadius: BorderRadius.circular(AppPrimitives.radiusLarge),
      border: Border.all(color: context.colors.border, width: 1.5),
      boxShadow: [
        BoxShadow(
          color: context.colors.accent.withValues(alpha: .16),
          blurRadius: 30,
        ),
      ],
    ),
    child: child,
  );
}
