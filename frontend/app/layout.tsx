import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Providers } from './providers';
import "./globals.css";

export const instant = false;

export const metadata: Metadata = {
  title: 'PickleVerso',
  description: 'Explore personagens, episódios e localidades de Rick and Morty.',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html
      lang={locale}
      className="h-full antialiased"
      data-theme="crystal-grove"
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
