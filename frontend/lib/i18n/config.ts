export const locales = ['pt-BR', 'en'] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'pt-BR';

export function normalizeLocale(value?: string | null): AppLocale {
  if (!value) return defaultLocale;

  const normalized = value.toLowerCase();
  return normalized.startsWith('en') ? 'en' : 'pt-BR';
}
