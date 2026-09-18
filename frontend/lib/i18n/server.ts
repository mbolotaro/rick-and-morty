import 'server-only';

import { cookies, headers } from 'next/headers';
import { normalizeLocale, type AppLocale } from './config';

export async function requestLocale(): Promise<AppLocale> {
  const [cookieStore, requestHeaders] = await Promise.all([
    cookies(),
    headers(),
  ]);

  return normalizeLocale(
    cookieStore.get('locale')?.value ??
      requestHeaders.get('accept-language'),
  );
}

export async function requestLanguage(): Promise<string> {
  return requestLocale();
}
