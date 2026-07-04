// app/notes/[id]/page.js
// Server Component: reads params.id, loads one note.
import { notFound } from 'next/navigation';
import { getNote } from '@/lib/notes';

export default async function NotePage({ params }) {
  const { id } = await params;
  const note = getNote(id);
  if (!note) notFound();

  return (
    <article>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </article>
  );
}
