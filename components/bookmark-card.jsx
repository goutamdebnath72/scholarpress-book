// components/bookmark-card.jsx
// Server Component card; delete is an inline form Server Action.
import { deleteBookmark } from '@/actions/bookmark';

export function BookmarkCard({ bookmark, lang }) {
  return (
    <li lang={lang} className="bookmark-card">
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
        {bookmark.title ?? bookmark.url}
      </a>
      <form
        action={async () => {
          'use server';
          await deleteBookmark(bookmark.id);
        }}
      >
        <button
          type="submit"
          className="bookmark-del"
          aria-label="Delete bookmark"
        ></button>
      </form>
    </li>
  );
}
