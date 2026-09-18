import { I18nContext } from 'nestjs-i18n';

type TranslationArguments = Record<string, string | number>;

export function translate(
  key: string,
  fallback: string,
  args?: TranslationArguments,
): string {
  const context = I18nContext.current();
  if (!context) return fallback;

  const translated = String(context.t(key, { args }));
  return translated === key ? fallback : translated;
}

export function currentLanguage(): string {
  return I18nContext.current()?.lang ?? 'pt-BR';
}
