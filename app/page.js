// app/page.js
// Server Component: no 'use client' directive, so it
// renders on the server and ships no JS of its own.
import LiveClock from './ui/live-clock';

export default function HomePage() {
  const renderedAt = new Date().toISOString();
  return (
    <main>
      <h1>ScholarPress</h1>
      <p>Notes and bookmarks, done simply.</p>
      <p>
        Server render time: <code>{renderedAt}</code>
      </p>
      <LiveClock />
    </main>
  );
}
