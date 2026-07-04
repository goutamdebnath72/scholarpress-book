// app/dashboard/recent-notes.js
import Link from 'next/link';
import { getRecentNotes } from '@/lib/data/dashboard';

export async function RecentNotes() {
  const notes = await getRecentNotes(5);
  return (
    <section>
      <h2>Recent notes</h2>
      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            <Link href={`/notes/${n.id}`}>{n.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
