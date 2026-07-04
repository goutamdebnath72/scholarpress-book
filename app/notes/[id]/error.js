// app/notes/[id]/error.js
'use client';

import { useEffect } from 'react';

export default function NoteError({ error, reset }) {
  useEffect(() => {
    console.error('note error', error.digest, error);
  }, [error]);

  return (
    <div>
      <h2>Could not load this note.</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
