// app/notes/page.js
// Server Component: lists notes, links to each detail.
import { allNotes } from '@/lib/notes';

export default function NotesPage() {
  const notes = allNotes();
  return (
    <main>
      <h1>Notes</h1>
      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            <a href={`/notes/${n.id}`}>{n.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
