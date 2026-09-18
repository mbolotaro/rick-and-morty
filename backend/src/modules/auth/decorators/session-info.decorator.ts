import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { SessionInfoPayload } from '../types/session-info.type.js';

export const SessionInfo = createParamDecorator(
  (_: object, context: ExecutionContext): SessionInfoPayload => {
    const request = context.switchToHttp().getRequest<Request>();
    return { ip: request.ip, userAgent: request.get('user-agent') };
  },
);
