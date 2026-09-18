import 'server-only';

import { getTranslations } from 'next-intl/server';
import type { z } from 'zod';
import { ApiError, apiErrorPayloadSchema } from './api-error';

export type ErrorMessageKey =
  | 'request'
  | 'invalidResponse'
  | 'signIn'
  | 'signUp'
  | 'signOut'
  | 'catalog'
  | 'resource'
  | 'favorites'
  | 'favoriteStatus'
  | 'favoriteMutation'
  | 'comments'
  | 'commentMutation'
  | 'ratingMutation';

export async function serverFetch(
  input: string | URL,
  init?: RequestInit,
): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    const t = await getTranslations('Errors');
    throw new ApiError(t('network'), 503);
  }
}

async function responseError(
  response: Response,
  fallbackKey: ErrorMessageKey,
): Promise<ApiError> {
  const t = await getTranslations('Errors');
  let fallback = t(fallbackKey);

  try {
    const result = apiErrorPayloadSchema.safeParse(await response.json());

    if (result.success) {
      const message = result.data.message;
      fallback = Array.isArray(message) ? message.join(' ') : message ?? fallback;

      return new ApiError(
        fallback,
        response.status,
        result.data.issues ?? [],
      );
    }
  } catch {
    // The localized fallback is used for malformed or empty error bodies.
  }

  return new ApiError(fallback, response.status);
}

export async function ensureResponse(
  response: Response,
  fallbackKey: ErrorMessageKey,
): Promise<void> {
  if (!response.ok) throw await responseError(response, fallbackKey);
}

export async function parseResponse<TSchema extends z.ZodType>(
  response: Response,
  schema: TSchema,
  fallbackKey: ErrorMessageKey,
): Promise<z.output<TSchema>> {
  await ensureResponse(response, fallbackKey);

  try {
    const result = schema.safeParse(await response.json());
    if (result.success) return result.data;
  } catch {
    // The response is handled by the same typed invalid-payload error below.
  }

  const t = await getTranslations('Errors');
  throw new ApiError(t('invalidResponse'), 502);
}
