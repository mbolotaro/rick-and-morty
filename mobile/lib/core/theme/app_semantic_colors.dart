import 'package:flutter/material.dart';
import 'package:pickle_verso/core/theme/app_primitives.dart';

@immutable
class AppSemanticColors extends ThemeExtension<AppSemanticColors> {
  const AppSemanticColors({
    required this.background,
    required this.surface,
    required this.surfaceElevated,
    required this.border,
    required this.contentPrimary,
    required this.contentSecondary,
    required this.accent,
    required this.accentSecondary,
    required this.danger,
    required this.warning,
  });

  static const dark = AppSemanticColors(
    background: AppPrimitives.ink950,
    surface: Color(0xE610251E),
    surfaceElevated: Color(0xF018372D),
    border: Color(0x6655E66B),
    contentPrimary: AppPrimitives.cream50,
    contentSecondary: AppPrimitives.cream300,
    accent: AppPrimitives.green500,
    accentSecondary: AppPrimitives.cyan400,
    danger: AppPrimitives.red400,
    warning: AppPrimitives.amber400,
  );

  final Color background;
  final Color surface;
  final Color surfaceElevated;
  final Color border;
  final Color contentPrimary;
  final Color contentSecondary;
  final Color accent;
  final Color accentSecondary;
  final Color danger;
  final Color warning;

  @override
  AppSemanticColors copyWith({
    Color? background,
    Color? surface,
    Color? surfaceElevated,
    Color? border,
    Color? contentPrimary,
    Color? contentSecondary,
    Color? accent,
    Color? accentSecondary,
    Color? danger,
    Color? warning,
  }) => AppSemanticColors(
    background: background ?? this.background,
    surface: surface ?? this.surface,
    surfaceElevated: surfaceElevated ?? this.surfaceElevated,
    border: border ?? this.border,
    contentPrimary: contentPrimary ?? this.contentPrimary,
    contentSecondary: contentSecondary ?? this.contentSecondary,
    accent: accent ?? this.accent,
    accentSecondary: accentSecondary ?? this.accentSecondary,
    danger: danger ?? this.danger,
    warning: warning ?? this.warning,
  );

  @override
  AppSemanticColors lerp(covariant AppSemanticColors? other, double t) {
    if (other == null) return this;
    return AppSemanticColors(
      background: Color.lerp(background, other.background, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      surfaceElevated: Color.lerp(surfaceElevated, other.surfaceElevated, t)!,
      border: Color.lerp(border, other.border, t)!,
      contentPrimary: Color.lerp(contentPrimary, other.contentPrimary, t)!,
      contentSecondary: Color.lerp(
        contentSecondary,
        other.contentSecondary,
        t,
      )!,
      accent: Color.lerp(accent, other.accent, t)!,
      accentSecondary: Color.lerp(accentSecondary, other.accentSecondary, t)!,
      danger: Color.lerp(danger, other.danger, t)!,
      warning: Color.lerp(warning, other.warning, t)!,
    );
  }
}

extension AppThemeContext on BuildContext {
  AppSemanticColors get colors =>
      Theme.of(this).extension<AppSemanticColors>()!;
}
