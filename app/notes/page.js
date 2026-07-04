// app/notes/page.js  —  Server Component
import Link from 'next/link';
import { getAllNotes } from '@/lib/data/notes';

export default async function NotesPage() {
  const notes = await getAllNotes();
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
