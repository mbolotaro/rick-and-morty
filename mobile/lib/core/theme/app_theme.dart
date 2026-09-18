import 'package:flutter/material.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';
import 'package:pickle_verso/core/theme/app_semantic_colors.dart';

abstract final class AppTheme {
  static ThemeData get dark {
    const colors = AppSemanticColors.dark;
    final scheme = ColorScheme.fromSeed(
      seedColor: colors.accent,
      brightness: Brightness.dark,
      surface: colors.surface,
      error: colors.danger,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: scheme,
      scaffoldBackgroundColor: colors.background,
      extensions: const [colors],
      textTheme:
          const TextTheme(
            headlineLarge: TextStyle(
              fontSize: 34,
              fontWeight: FontWeight.w900,
              letterSpacing: -1,
            ),
            headlineSmall: TextStyle(fontSize: 24, fontWeight: FontWeight.w800),
            titleLarge: TextStyle(fontSize: 20, fontWeight: FontWeight.w800),
            titleMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
            bodyLarge: TextStyle(fontSize: 16, height: 1.45),
            bodyMedium: TextStyle(fontSize: 14, height: 1.4),
          ).apply(
            bodyColor: colors.contentPrimary,
            displayColor: colors.contentPrimary,
          ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: colors.surface,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppPrimitives.space4,
          vertical: AppPrimitives.space4,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppPrimitives.radiusMedium),
          borderSide: BorderSide(color: colors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppPrimitives.radiusMedium),
          borderSide: BorderSide(color: colors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppPrimitives.radiusMedium),
          borderSide: BorderSide(color: colors.accent, width: 2),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: colors.surfaceElevated,
        indicatorColor: colors.accent.withValues(alpha: .22),
        labelTextStyle: const WidgetStatePropertyAll(
          TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}
