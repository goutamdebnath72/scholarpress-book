// app/dashboard/page.js
import {
  getNoteCount,
  getRecentNotes,
  getTopTags,
} from '@/lib/data/dashboard';

export default async function Dashboard() {
  // Three independent reads in parallel.
  const [count, recent, topTags] = await Promise.all([
    getNoteCount(),
    getRecentNotes(),
    getTopTags(),
  ]);

  return (
    <section>
      <h1>Dashboard</h1>
      <p>{count} notes total</p>
      <RecentList notes={recent} />
      <TopTagsChart tags={topTags} />
    </section>
  );
}

