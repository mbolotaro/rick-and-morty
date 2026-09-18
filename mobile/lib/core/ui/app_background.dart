import 'package:flutter/material.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';

class AppBackground extends StatelessWidget {
  const AppBackground({required this.child, super.key});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/images/crystal-grove-background.jpg'),
          fit: BoxFit.cover,
        ),
      ),
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              context.colors.background.withValues(alpha: .58),
              context.colors.background.withValues(alpha: .93),
            ],
          ),
        ),
        child: child,
      ),
    );
  }
}
