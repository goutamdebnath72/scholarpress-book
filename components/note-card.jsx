// components/note-card.jsx
import { ViewTransition } from 'react';
import Link from 'next/link';

export function NoteCard({ note, lang }) {
  return (
    <li className="note-card">
      <Link href={`/${lang}/notes/${note.id}`}>
        <ViewTransition name={`note-${note.id}-title`}>
          <h2>{note.title}</h2>
        </ViewTransition>
      </Link>
    </li>
  );
}

// app/notes/[id]/page.js
export default async function NotePage({ params }) {
  const { id } = await params;
  const note = await getNote(id);
  return (
    <article>
      <ViewTransition name={`note-${note.id}-title`}>
        <h1>{note.title}</h1>
      </ViewTransition>
      <p>{note.content}</p>
    </article>
  );
}
