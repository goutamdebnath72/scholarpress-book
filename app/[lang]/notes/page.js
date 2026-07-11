// app/[lang]/notes/page.js
// Server Component — fetches notes and renders them server-side
// No 'use client' — all data fetching happens before the HTML leaves the server
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { ILike } from 'typeorm';
import { getRepos } from '@/data-source';
import { getTranslations } from 'next-intl/server'; // Ch 3
import { NoteCard } from '@/components/note-card';
import { NoteSearch } from '@/components/note-search'; // 'use client'

export default async function NotesPage({ params, searchParams }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/en/sign-in');

  const { lang } = await params;
  const { q } = await searchParams; // search query from URL
  const t = await getTranslations({ locale: lang });

  const { noteRepo } = await getRepos();

  // Base owner scope; optional case-insensitive search on title/content.
  // ILike is parameterised by TypeORM, so there is no injection risk.
  const where = q
    ? [
        { userId: session.user.id, title: ILike(`%${q}%`) },
        { userId: session.user.id, content: ILike(`%${q}%`) },
      ]
    : { userId: session.user.id };

  const notes = await noteRepo.find({
    where,
    order: { createdAt: 'DESC' },
    relations: { tags: true }, // eager-load tags to show chips (Ch 2 §2.19)
  });

  return (
    <main>
      <h1>{t('notes.title')}</h1>
      <p>
        <a href={`/${lang}/notes/new`}>+ New note</a>
      </p>
      <NoteSearch placeholder={t('notes.searchPlaceholder')} />
      {notes.length === 0 ? (
        <p>{t('notes.empty')}</p>
      ) : (
        <ul>
          {notes.map((n) => (
            <NoteCard key={n.id} note={n} lang={lang} />
          ))}
        </ul>
      )}
    </main>
  );
}
