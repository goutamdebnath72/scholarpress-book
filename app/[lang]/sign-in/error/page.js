// app/[lang]/sign-in/error/page.js
// The page Auth.js redirects to on authentication failure
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

const MESSAGES = {
  OAuthCallbackError: {
    title: 'Session expired',
    body: 'Your sign-in session expired. Please try again.',
    recover: 'Try signing in again',
  },
  AccessDenied: {
    title: 'Access restricted',
    body: 'This application is restricted to members of the university organisation.',
    recover: null, // no recovery possible
  },
  Configuration: {
    title: 'Configuration error',
    body: 'The sign-in service is temporarily unavailable.',
    recover: 'Try again later',
  },
};

export default async function SignInErrorPage({ searchParams }) {
  const { error } = await searchParams;
  const msg = MESSAGES[error] ?? MESSAGES.Configuration;
  return (
    <main>
      <h1>{msg.title}</h1>
      <p>{msg.body}</p>
      {msg.recover && <Link href="/en/sign-in">{msg.recover}</Link>}
    </main>
  );
}
