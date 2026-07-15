// app/[lang]/layout.js
// Root layout for the locale segment. Wraps every page with the
// <html>/<body> shell, the next-intl provider, and the locale switcher.
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { auth } from '@/auth';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { SignOutButton } from '@/components/sign-out-button';
import './globals.css';

export const metadata = {
  title: 'ScholarPress',
  description: 'A small notes-and-bookmarks app, built across the book.',
};

export default async function LocaleLayout({ children, params }) {
  const { lang } = await params;
  const messages = await getMessages({ locale: lang });

  // The header is the one piece of chrome on every page, so it is where the
  // sign-out control belongs. It also means the nav is no longer shown to
  // signed-out visitors, who cannot open any of those pages anyway.
  const session = await auth();
  const signedIn = Boolean(session?.user?.id);

  return (
    <html lang={lang}>
      <body>
        <NextIntlClientProvider locale={lang} messages={messages}>
          <header>
            <a href={`/${lang}`}>
              <strong>ScholarPress</strong>
            </a>
            {signedIn && (
              <nav>
                <a href={`/${lang}/notes`}>Notes</a>
                <a href={`/${lang}/bookmarks`}>Bookmarks</a>
                <a href={`/${lang}/dashboard`}>Dashboard</a>
              </nav>
            )}
            <LocaleSwitcher />
            {signedIn && <SignOutButton lang={lang} />}
          </header>
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
