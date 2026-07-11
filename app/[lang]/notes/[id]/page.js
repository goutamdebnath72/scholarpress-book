// app/[lang]/notes/[id]/page.js
// Server Component — fetch one note, owner-scoped.
import { auth } from '@/auth';
import { redirect, notFound } from 'next/navigation';
import { getRepos } from '@/data-source';
import { getTranslations } from 'next-intl/server';
import { deleteNote } from '@/actions/note';

export default async function NotePage({ params }) {
  const { lang, id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${lang}/sign-in`);

  const { noteRepo } = await getRepos();

  // Owner scope is in the WHERE clause, not an after-the-fact check:
  // a note that is not yours simply is not found.
  const note = await noteRepo.findOne({
    where: { id, userId: session.user.id },
    relations: { tags: true }, // load tags to display them
  });
  if (!note) notFound();

  const t = await getTranslations({ locale: lang });

  return (
    <article>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
      {note.tags?.length > 0 && (
        <div className="tag-chips tag-chips-static">
          {note.tags.map((tag) => (
            <span key={tag.id} className="tag-chip tag-chip-readonly">
              {tag.name}
            </span>
          ))}
        </div>
      )}
      <footer>
        {t('notes.created')}: {note.createdAt.toLocaleDateString(lang)}
      </footer>
      <form
        action={async () => {
          'use server';
          await deleteNote(id);
          redirect(`/${lang}/notes`);
        }}
      >
        <button type="submit">Delete</button>
      </form>
    </article>
  );
}
