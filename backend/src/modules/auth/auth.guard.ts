import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { translate } from '../../common/i18n/translate.js';
import { IS_PUBLIC_KEY } from './public.decorator.js';
import { TokenService } from './token.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokens: TokenService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true;
    const request = context.switchToHttp().getRequest<Request>();
    const bearer =
      request.headers.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    const token =
      bearer ?? (request.cookies?.access_token as string | undefined);
    if (!token)
      throw new UnauthorizedException(
        translate('errors.auth.notAuthenticated', 'Não autenticado.'),
      );
    try {
      request.user = await this.tokens.verifyAccess(token);
      return true;
    } catch {
      throw new UnauthorizedException(
        translate(
          'errors.auth.invalidSession',
          'Sessão inválida ou expirada.',
        ),
      );
    }
  }
}
