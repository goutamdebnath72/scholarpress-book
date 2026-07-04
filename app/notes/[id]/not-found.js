// app/notes/[id]/not-found.js
import Link from 'next/link';

export default function NoteNotFound() {
  return (
    <div>
      <h2>Note not found.</h2>
      <p>It may have been deleted or never existed.</p>
      <Link href="/notes">All notes</Link>
    </div>
  );
}
