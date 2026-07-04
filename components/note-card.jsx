// components/note-card.jsx
// Presentational Server Component — one note in the list.
import Link from 'next/link'

export function NoteCard({ note, lang }) {
  return (
    <li>
      <Link href={`/${lang}/notes/${note.id}`}>
        <h2>{note.title}</h2>
        {note.content && (
          <p>{note.content.slice(0, 140)}</p>
        )}
      </Link>
      {note.tags?.length > 0 && (
        <div className="tag-chips tag-chips-static">
          {note.tags.map((t) => (
            <span key={t.id} className="tag-chip tag-chip-readonly">{t.name}</span>
          ))}
        </div>
      )}
    </li>
  )
}
