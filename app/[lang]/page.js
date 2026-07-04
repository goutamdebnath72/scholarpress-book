// app/[lang]/page.js
// Server Component — the localized landing page.
import { auth }            from '@/auth'
import { redirect }        from 'next/navigation'
import { getTranslations } from 'next-intl/server'  // Ch 3
import Link                from 'next/link'

export default async function HomePage({ params }) {
  const { lang } = await params
  const session  = await auth()

  // A signed-in user has no reason to see the landing page.
  if (session?.user?.id) redirect(`/${lang}/dashboard`)

  const t = await getTranslations({ locale: lang })

  return (
    <main>
      <h1>{t('home.title')}</h1>
      <p>{t('home.tagline')}</p>
      <Link href={`/${lang}/sign-in`}>{t('home.signIn')}</Link>
    </main>
  )
}
