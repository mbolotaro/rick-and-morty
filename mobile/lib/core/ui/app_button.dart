import 'package:flutter/material.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';

class AppButton extends StatelessWidget {
  const AppButton({
    required this.label,
    required this.onPressed,
    this.isLoading = false,
    super.key,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 54,
      child: FilledButton(
        onPressed: isLoading ? null : onPressed,
        style: FilledButton.styleFrom(
          backgroundColor: context.colors.accent,
          foregroundColor: AppPrimitives.ink950,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppPrimitives.radiusMedium),
            side: const BorderSide(color: AppPrimitives.ink950, width: 2),
          ),
          textStyle: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900),
        ),
        child: isLoading
            ? const SizedBox.square(
                dimension: 22,
                child: CircularProgressIndicator(strokeWidth: 2.5),
              )
            : Text(label),
      ),
    );
  }
}
