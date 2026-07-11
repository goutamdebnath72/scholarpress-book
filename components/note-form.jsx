// components/note-form.jsx
'use client';

import { useActionState } from 'react';
import { createNote } from '@/actions/note';
import { TagInput } from '@/components/tag-input';

export function NoteForm({ lang, tagSuggestions = [] }) {
  const [state, formAction, pending] = useActionState(createNote, {});

  return (
    <form action={formAction}>
      <input name="title" required placeholder="Title" />
      <textarea name="content" placeholder="Write your note..." />

      <TagInput name="tags" suggestions={tagSuggestions} />

      {state?.error && <p role="alert">{state.error}</p>}

      <button type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save note'}
      </button>
    </form>
  );
}
