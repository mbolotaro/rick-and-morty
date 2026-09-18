import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export interface CurrentUserPayload {
  sub: string;
  scope: 'full' | 'unverified';
}
export const CurrentUser = createParamDecorator(
  (_: object, context: ExecutionContext): CurrentUserPayload =>
    context.switchToHttp().getRequest().user,
);
