import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { translate } from '../../../../common/i18n/translate.js';
import type { AccessTokenPayload } from '../../domain/types/token-payload.type.js';

export type CurrentUserPayload = AccessTokenPayload;

export const CurrentUser = createParamDecorator(
  (_: object, context: ExecutionContext): CurrentUserPayload => {
    const user = context.switchToHttp().getRequest<Request>().user;

    if (!user) {
      throw new UnauthorizedException(
        translate('errors.auth.notAuthenticated', 'Não autenticado.'),
      );
    }

    return user;
  },
);
