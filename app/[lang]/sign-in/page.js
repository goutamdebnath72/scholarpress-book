// app/[lang]/sign-in/page.js
// Server Component — renders the provider button.
// The form action is the signIn Server Action from @/auth.
import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function SignInPage({ params }) {
  const { lang } = await params;
  const session = await auth();
  if (session?.user?.id) redirect(`/${lang}/dashboard`);

  const t = await getTranslations({ locale: lang });

  // Under the E2E flag only, offer the credentials shortcut instead of OAuth.
  // A headless browser cannot complete the GitHub dance (Chapter 4 §4.9), and
  // this form is what tests/e2e/fixtures.js drives. Never present in a
  // production build, because E2E is never set there.
  const isE2E = process.env.E2E === '1';

  return (
    <main>
      <h1>{t('signIn.title')}</h1>
      {isE2E ? (
        <form
          action={async (formData) => {
            'use server';
            await signIn('credentials', {
              email: formData.get('email'),
              redirectTo: `/${lang}/dashboard`,
            });
          }}
        >
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
          <button type="submit">Sign in</button>
        </form>
      ) : (
        <form
          action={async () => {
            'use server';
            await signIn('github', { redirectTo: `/${lang}/dashboard` });
          }}
        >
          <button type="submit">Sign in with GitHub</button>
        </form>
      )}
    </main>
  );
}
