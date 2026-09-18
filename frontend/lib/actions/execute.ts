import type { ActionResult } from './result';
import { actionFailure, actionSuccess } from './result';

export async function executeAction<T>(
  operation: () => Promise<T>,
  fallback: string,
): Promise<ActionResult<T>> {
  try {
    return actionSuccess(await operation());
  } catch (error) {
    return actionFailure(
      error instanceof Error ? error : new Error(fallback),
      fallback,
    );
  }
}
