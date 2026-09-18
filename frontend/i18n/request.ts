import { getRequestConfig } from 'next-intl/server';
import englishMessages from '@/messages/en.json';
import portugueseMessages from '@/messages/pt-BR.json';
import { requestLocale } from '@/lib/i18n/server';

const messages = {
  'pt-BR': portugueseMessages,
  en: englishMessages,
};

export default getRequestConfig(async () => {
  const locale = await requestLocale();

  return {
    locale,
    messages: messages[locale],
  };
});
