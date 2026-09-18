import { ApiError } from '@/lib/http/api-error';

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

export class ActionError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ActionError';
  }
}

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function actionFailure(
  error: Error,
  fallback: string,
): ActionResult<never> {
  return {
    ok: false,
    error: error.message || fallback,
    status: error instanceof ApiError ? error.status : 500,
  };
}

export function unwrapAction<T>(result: ActionResult<T>): T {
  if (!result.ok) throw new ActionError(result.error, result.status);
  return result.data;
}
