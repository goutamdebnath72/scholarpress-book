// app/notes/page.js
import Link from 'next/link';
import { allNotes } from '@/lib/notes';

export default function NotesPage() {
  const notes = allNotes();
  return (
    <main>
      <h1>Notes</h1>
      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            <Link href={`/notes/${n.id}`}>{n.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
