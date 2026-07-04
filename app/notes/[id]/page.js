// app/notes/[id]/page.js
import { notFound } from 'next/navigation';
import { getCachedNote } from '@/lib/data/notes';

export default async function NotePage({ params }) {
  const { id } = await params;
  const note = await getCachedNote(id);
  if (!note) notFound();
  return (
    <article>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </article>
  );
}
