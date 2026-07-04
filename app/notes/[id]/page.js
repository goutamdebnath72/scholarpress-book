// app/notes/[id]/page.js  —  Server Component
import { notFound } from 'next/navigation';
import BackButton from '@/app/ui/back-button';
import { getNote } from '@/lib/data/notes';

export default async function NotePage({ params }) {
  const { id } = await params;
  const note = await getNote(id);
  if (!note) notFound();

  return (
    <article>
      <BackButton>Back to all notes</BackButton>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </article>
  );
}
