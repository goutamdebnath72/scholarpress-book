// actions/locale.js — set locale cookie from the switcher
'use server';

import { cookies } from 'next/headers';

const SUPPORTED_LOCALES = ['en', 'bn'];

export async function setLocale(locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return;

  const jar = await cookies();
  jar.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 365 * 24 * 60 * 60, // 1 year
    sameSite: 'lax',
    httpOnly: false, // client-readable for the switcher UI
  });
}
