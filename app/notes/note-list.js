'use client';
import { useOptimistic, startTransition } from 'react';
import { deleteNote } from '@/app/lib/actions/notes';

export function NoteList({ notes }) {
  const [optimisticNotes, removeNote] = useOptimistic(
    notes,
    (current, idToRemove) =>
      current.filter(n => n.id !== idToRemove),
  )

  function handleDelete(id) {
    startTransition(async () => {
      removeNote(id);
      await deleteNote(id);
    });
  }

  return (
    <ul>
      {optimisticNotes.map(n => (
        <li key={n.id}>
          <a href={`/notes/${n.id}`}>{n.title}</a>
          <button onClick={() => handleDelete(n.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

