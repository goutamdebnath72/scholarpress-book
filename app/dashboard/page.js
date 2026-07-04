// app/dashboard/page.js
import { Suspense } from 'react';
import { RecentNotes } from './recent-notes';
import { TopTags } from './top-tags';
import { RecentNotesSkeleton, TopTagsSkeleton } from './skeletons';

export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>

      <Suspense fallback={<RecentNotesSkeleton />}>
        <RecentNotes />
      </Suspense>

      <Suspense fallback={<TopTagsSkeleton />}>
        <TopTags />
      </Suspense>
    </main>
  );
}
