// app/[lang]/sign-in/page.js
// Server Component — renders the provider button.
// The form action is the signIn Server Action from @/auth.
import { auth, signIn }    from '@/auth'
import { redirect }        from 'next/navigation'
import { getTranslations } from 'next-intl/server'

export default async function SignInPage({ params }) {
  const { lang } = await params
  const session  = await auth()
  if (session?.user?.id) redirect(`/${lang}/dashboard`)

  const t = await getTranslations({ locale: lang })

  return (
    <main>
      <h1>{t('signIn.title')}</h1>
      <form
        action={async () => {
          'use server'
          await signIn('github', { redirectTo: `/${lang}/dashboard` })
        }}
      >
        <button type="submit">Sign in with GitHub</button>
      </form>
    </main>
  )
}