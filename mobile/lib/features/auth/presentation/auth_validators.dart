abstract final class AuthValidators {
  static String? name(String? value) {
    final normalized = value?.trim() ?? '';
    if (normalized.isEmpty) return 'Este campo é obrigatório.';
    if (normalized.length > 100) return 'Use no máximo 100 caracteres.';
    return null;
  }

  static String? email(String? value) {
    final normalized = value?.trim() ?? '';
    return RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(normalized)
        ? null
        : 'Informe um e-mail válido.';
  }

  static String? password(String? value) =>
      (value?.isEmpty ?? true) ? 'Informe sua senha.' : null;

  static String? strongPassword(String? value) {
    final password = value ?? '';
    if (password.length < 8 || password.length > 72) {
      return 'A senha deve ter entre 8 e 72 caracteres.';
    }
    if (!RegExp(r'(?=.*[a-z])(?=.*[A-Z])(?=.*\d)').hasMatch(password)) {
      return 'Use letra maiúscula, minúscula e número.';
    }
    return null;
  }
}
