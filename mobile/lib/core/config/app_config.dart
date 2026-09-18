abstract final class AppConfig {
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://127.0.0.1:3040',
  );

  static const requestTimeout = Duration(seconds: 10);
}
