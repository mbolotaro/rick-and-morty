import 'package:flutter/material.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';
import 'package:pickle_verso/core/ui/app_background.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppBackground(
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Image.asset('assets/images/pickle-rick.webp', height: 150),
              const SizedBox(height: AppPrimitives.space4),
              Text(
                'PICKLEVERSE',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: AppPrimitives.space4),
              CircularProgressIndicator(color: context.colors.accent),
            ],
          ),
        ),
      ),
    );
  }
}
