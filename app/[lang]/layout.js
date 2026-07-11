// app/[lang]/layout.js
// Root layout for the locale segment. Wraps every page with the
// <html>/<body> shell, the next-intl provider, and the locale switcher.
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/locale-switcher';
import './globals.css';

export const metadata = {
  title: 'ScholarPress',
  description: 'A small notes-and-bookmarks app, built across the book.',
};

export default async function LocaleLayout({ children, params }) {
  const { lang } = await params;
  const messages = await getMessages({ locale: lang });

  return (
    <html lang={lang}>
      <body>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <header>
            <a href={`/${lang}`}>
              <strong>ScholarPress</strong>
            </a>
            <nav>
              <a href={`/${lang}/notes`}>Notes</a>
              <a href={`/${lang}/bookmarks`}>Bookmarks</a>
              <a href={`/${lang}/dashboard`}>Dashboard</a>
            </nav>
            <LocaleSwitcher />
          </header>
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
