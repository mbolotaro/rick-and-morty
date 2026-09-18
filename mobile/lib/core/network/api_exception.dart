import 'package:dio/dio.dart';

class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode});

  factory ApiException.fromDio(DioException error) {
    final data = error.response?.data;
    if (data case final Map<String, Object?> json) {
      final message = json['message'];
      if (message is String && message.isNotEmpty) {
        return ApiException(message, statusCode: error.response?.statusCode);
      }
      if (message case final List<Object?> messages when messages.isNotEmpty) {
        return ApiException(
          messages.whereType<String>().join(' '),
          statusCode: error.response?.statusCode,
        );
      }
    }

    return ApiException(
      error.type == DioExceptionType.connectionError ||
              error.type == DioExceptionType.connectionTimeout
          ? 'Não foi possível conectar ao servidor.'
          : 'Não foi possível concluir a solicitação.',
      statusCode: error.response?.statusCode,
    );
  }

  final String message;
  final int? statusCode;

  @override
  String toString() => message;
}
