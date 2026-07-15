// components/sign-out-button.jsx
// Server Component — renders the sign-out control.
//
// auth.js already exported signOut; nothing ever called it, so once you signed
// in there was no way back out. This is the missing half.
//
// Same shape as the sign-in form in app/[lang]/sign-in/page.js: a <form> whose
// action is the signOut Server Action. No 'use client' needed — the form posts
// to the server, which clears the session cookie and redirects.
import { signOut } from '@/auth';
import { getTranslations } from 'next-intl/server';

export async function SignOutButton({ lang }) {
  const t = await getTranslations({ locale: lang });

  return (
    <form
      action={async () => {
        'use server';
        // redirectTo sends the user to the localised home page rather than
        // leaving them on a page they can no longer see.
        await signOut({ redirectTo: `/${lang}` });
      }}
    >
      <button type="submit">{t('auth.signOut')}</button>
    </form>
  );
}
