typedef JsonObject = Map<String, Object?>;

abstract final class JsonReader {
  static JsonObject object(Object? value, [String path = 'response']) {
    if (value case final Map<String, Object?> json) return json;
    throw FormatException('$path deve ser um objeto JSON.');
  }

  static List<Object?> list(Object? value, [String path = 'response']) {
    if (value case final List<Object?> values) return values;
    throw FormatException('$path deve ser uma lista JSON.');
  }

  static String string(JsonObject json, String key) {
    final value = json[key];
    if (value is String) return value;
    throw FormatException('$key deve ser uma string.');
  }

  static String? nullableString(JsonObject json, String key) {
    final value = json[key];
    if (value == null || value is String) return value as String?;
    throw FormatException('$key deve ser uma string ou nulo.');
  }

  static int integer(JsonObject json, String key) {
    final value = json[key];
    if (value is int) return value;
    throw FormatException('$key deve ser um inteiro.');
  }

  static bool boolean(JsonObject json, String key) {
    final value = json[key];
    if (value is bool) return value;
    throw FormatException('$key deve ser booleano.');
  }
}
