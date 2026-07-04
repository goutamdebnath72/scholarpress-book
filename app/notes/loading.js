// app/notes/loading.js
import SkeletonCard from '@/components/skeleton-card';

export default function Loading() {
  return (
    <ul>
      {[1, 2, 3, 4, 5].map((i) => (
        <li key={i}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );
}
