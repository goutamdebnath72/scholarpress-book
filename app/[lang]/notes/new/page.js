// app/[lang]/notes/new/page.js
// Server Component — guards the route, then renders the form.
import { auth }            from '@/auth'
import { redirect }        from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getRepos }        from '@/data-source'
import { NoteForm }        from '@/components/note-form'  // 'use client'

export default async function NewNotePage({ params }) {
  const { lang } = await params
  const session  = await auth()
  if (!session?.user?.id) redirect(`/${lang}/sign-in`)

  const t = await getTranslations({ locale: lang })

  // Offer the user's existing tags as autocomplete suggestions.
  const { tagRepo } = await getRepos()
  const tags = await tagRepo.find({
    where: { userId: session.user.id },
    order: { name: 'ASC' },
  })
  const tagSuggestions = tags.map((t) => t.name)

  return (
    <main>
      <h1>{t('notes.newTitle')}</h1>
      <NoteForm lang={lang} tagSuggestions={tagSuggestions} />
    </main>
  )
}
