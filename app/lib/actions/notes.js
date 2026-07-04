// app/lib/actions/notes.js  (revalidation added)
'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { notesStore } from '@/lib/data/notes';

export async function createNote(prevState, formData) {
  const session = await getSession();
  if (!session?.user?.id) redirect('/sign-in');

  const title = formData.get('title')?.trim();
  const content = formData.get('content')?.trim() ?? '';
  if (!title) return { error: 'Title is required.' };

  const note = await notesStore.insert({
    title,
    content,
    userId: session.user.id,
  });

  // Collection tag: the list. Entry tag: this note.
  updateTag('notes');
  updateTag(`note-${note.id}`);

  redirect(`/notes/${note.id}`);
}
