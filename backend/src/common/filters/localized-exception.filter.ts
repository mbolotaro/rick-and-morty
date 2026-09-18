import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApplicationError } from '../errors/application-error.js';
import { translate } from '../i18n/translate.js';

type ErrorBody = Record<
  string,
  string | number | string[] | Array<Record<string, string>>
>;

const defaultMessages = new Set([
  'Bad Request',
  'Unauthorized',
  'Forbidden',
  'Not Found',
  'Conflict',
  'Internal Server Error',
  'Bad Gateway',
]);

@Catch()
export class LocalizedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LocalizedExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof ApplicationError) {
      response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        message: translate(exception.messageKey, exception.fallback),
        error: this.statusTitle(exception.statusCode),
      });
      return;
    }

    if (!(exception instanceof HttpException)) {
      this.logger.error(exception.message, exception.stack);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.statusMessage(HttpStatus.INTERNAL_SERVER_ERROR),
      });
      return;
    }

    const status = exception.getStatus();
    const original = exception.getResponse();

    if (typeof original === 'string') {
      response.status(status).json({ statusCode: status, message: original });
      return;
    }

    const body = original as ErrorBody;
    const message = body.message;
    const isFrameworkMessage =
      typeof message !== 'string' ||
      defaultMessages.has(message) ||
      message.startsWith('Cannot ') ||
      message.startsWith('Validation failed') ||
      message.startsWith('Unexpected token') ||
      message.includes('JSON at position');

    response.status(status).json({
      ...body,
      statusCode: status,
      message: isFrameworkMessage ? this.statusMessage(status) : message,
      error: this.statusTitle(status),
    });
  }

  private statusMessage(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return translate('errors.http.badRequest', 'Requisição inválida.');
      case HttpStatus.UNAUTHORIZED:
        return translate('errors.http.unauthorized', 'Não autenticado.');
      case HttpStatus.FORBIDDEN:
        return translate(
          'errors.http.forbidden',
          'Você não tem permissão para realizar esta ação.',
        );
      case HttpStatus.NOT_FOUND:
        return translate('errors.http.notFound', 'Recurso não encontrado.');
      case HttpStatus.CONFLICT:
        return translate(
          'errors.http.conflict',
          'A operação entrou em conflito com o estado atual do recurso.',
        );
      case HttpStatus.BAD_GATEWAY:
        return translate(
          'errors.http.badGateway',
          'Não foi possível concluir a comunicação com o serviço externo.',
        );
      default:
        return translate(
          'errors.http.internalServerError',
          'Ocorreu um erro interno no servidor.',
        );
    }
  }

  private statusTitle(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return translate('errors.httpTitle.badRequest', 'Requisição inválida');
      case HttpStatus.UNAUTHORIZED:
        return translate('errors.httpTitle.unauthorized', 'Não autorizado');
      case HttpStatus.FORBIDDEN:
        return translate('errors.httpTitle.forbidden', 'Acesso proibido');
      case HttpStatus.NOT_FOUND:
        return translate('errors.httpTitle.notFound', 'Não encontrado');
      case HttpStatus.CONFLICT:
        return translate('errors.httpTitle.conflict', 'Conflito');
      case HttpStatus.BAD_GATEWAY:
        return translate(
          'errors.httpTitle.badGateway',
          'Falha no serviço externo',
        );
      default:
        return translate(
          'errors.httpTitle.internalServerError',
          'Erro interno do servidor',
        );
    }
  }
}
