// app/notes/page.js  —  Server Component
import Link from 'next/link';
import { getAllNotes } from '@/lib/data/notes';
import { NoteSearch } from '@/components/note-search';

export default async function NotesPage({ searchParams }) {
  const { q } = await searchParams;
  const notes = await getAllNotes();
  const term = (q ?? '').toLowerCase();
  const shown = term
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(term) ||
          n.content.toLowerCase().includes(term),
      )
    : notes;

  return (
    <main>
      <h1>Notes</h1>
      <NoteSearch placeholder="Search notes" />
      <ul>
        {shown.map((n) => (
          <li key={n.id}>
            <Link href={`/notes/${n.id}`}>{n.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
