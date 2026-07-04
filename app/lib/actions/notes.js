// app/lib/actions/notes.js
'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { notesStore } from '@/lib/data/notes';
import { CreateNoteInput } from '@/lib/schemas/actions';

export async function createNote(prevState, formData) {
  // 1. Authenticate (a stub until Volume II adds real auth).
  const session = await getSession();
  if (!session?.user?.id) redirect('/sign-in');

  // 2. Validate.
  const parsed = CreateNoteInput.safeParse({
    title: formData.get('title'),
    content: formData.get('content') ?? '',
    tags: (formData.get('tags') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  });
  if (!parsed.success) {
    return { error: 'Title is required.' };
  }

  // 3. Mutate. 4. Revalidate.
  await notesStore.insert({
    ...parsed.data,
    userId: session.user.id,
  });
  revalidatePath('/notes');

  // 5. Redirect on success.
  redirect('/notes');
}
