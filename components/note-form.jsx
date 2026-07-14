// components/note-form.jsx
'use client';

import { useActionState } from 'react';
import { createNote } from '@/actions/note';
import { TagInput } from '@/components/tag-input';

export function NoteForm({ lang, tagSuggestions = [] }) {
  const [state, formAction, pending] = useActionState(createNote, {});

  return (
    <form action={formAction}>
      {/* A placeholder is NOT a label: it vanishes on input and screen readers
          announce nothing. These inputs previously had only placeholders, which
          is an accessibility defect and is also why the E2E test could not find
          them -- getByLabel('Title') matches a <label>, not a placeholder. */}
      <label htmlFor="note-title">Title</label>
      <input id="note-title" name="title" required placeholder="Title" />

      <label htmlFor="note-content">Content</label>
      <textarea
        id="note-content"
        name="content"
        placeholder="Write your note..."
      />

      <TagInput name="tags" suggestions={tagSuggestions} />

      {state?.error && <p role="alert">{state.error}</p>}

      <button type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save note'}
      </button>
    </form>
  );
}
