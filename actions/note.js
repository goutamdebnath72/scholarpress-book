// actions/note.js
// Three Server Actions: create, update, delete
// All three: authenticate, validate, mutate, revalidate, return
'use server';

import * as Sentry from '@sentry/nextjs'; // Chapter 8
import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getRepos } from '@/data-source';
import logger from '@/lib/logger'; // Chapter 8

// Turn the comma-separated "tags" field into Tag entities, creating any
// that do not exist yet for this user (find-or-create, owner-scoped).
async function resolveTags(tagRepo, userId, raw) {
  const names = [
    ...new Set(
      (raw ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => t.slice(0, 40)), // guard against absurd lengths
    ),
  ];
  const tags = [];
  for (const name of names) {
    let tag = await tagRepo.findOne({ where: { userId, name } });
    if (!tag) {
      tag = tagRepo.create({ userId, name });
      await tagRepo.save(tag);
    }
    tags.push(tag);
  }
  return tags;
}

export async function createNote(prevState, formData) {
  const session = await auth();
  if (!session?.user?.id) redirect('/en/sign-in');

  const log = logger.child({
    requestId: (await headers()).get('x-request-id'),
    action: 'createNote',
    userId: session.user.id,
  });

  const title = formData.get('title')?.trim();
  const content = formData.get('content')?.trim() ?? '';
  if (!title) return { error: 'Title is required.' };

  let created = false;
  try {
    const { noteRepo, tagRepo } = await getRepos();
    const tags = await resolveTags(
      tagRepo,
      session.user.id,
      formData.get('tags'),
    );
    const note = noteRepo.create({
      userId: session.user.id,
      title,
      content,
      tags,
    });
    await noteRepo.save(note); // saves the notes_tags links too
    log.info({ noteId: note.id, tagCount: tags.length }, 'Note created');
    revalidatePath('/[lang]/notes', 'page');
    created = true;
  } catch (err) {
    log.error({ err }, 'Failed to create note');
    Sentry.captureException(err, { user: { id: session.user.id } });
    return { error: 'Could not save note. Please try again.' };
  }

  // redirect() throws a control-flow signal, so it must live OUTSIDE the
  // try/catch (a catch would swallow it). Only redirect on success.
  if (created) redirect('/en/notes');
}

export async function updateNote(noteId, formData) {
  const session = await auth();
  if (!session?.user?.id) redirect('/en/sign-in');

  const { noteRepo, tagRepo } = await getRepos();
  // Owner-scoped fetch: a note that is not yours is not found.
  // Load tags so TypeORM can diff the many-to-many links on save.
  const note = await noteRepo.findOne({
    where: { id: noteId, userId: session.user.id },
    relations: { tags: true },
  });
  if (!note) return { error: 'Not found or not yours.' };

  note.title = formData.get('title')?.trim() ?? note.title;
  note.content = formData.get('content')?.trim() ?? note.content;
  if (formData.has('tags')) {
    note.tags = await resolveTags(
      tagRepo,
      session.user.id,
      formData.get('tags'),
    );
  }
  try {
    await noteRepo.save(note);
    revalidatePath('/[lang]/notes', 'page');
    return { success: true };
  } catch (err) {
    Sentry.captureException(err, { user: { id: session.user.id } });
    return { error: 'Could not update note.' };
  }
}

export async function deleteNote(noteId) {
  const session = await auth();
  if (!session?.user?.id) redirect('/en/sign-in');

  const { noteRepo } = await getRepos();
  const note = await noteRepo.findOne({
    where: { id: noteId, userId: session.user.id },
  });
  if (!note) return { error: 'Not found or not yours.' };

  // Hard delete: remove the row (entity has no deletedAt column).
  // The notes_tags join rows are removed automatically; the Tag rows
  // themselves are left intact for reuse on other notes.
  try {
    await noteRepo.remove(note);
    revalidatePath('/[lang]/notes', 'page');
    return { success: true };
  } catch (err) {
    Sentry.captureException(err, { user: { id: session.user.id } });
    return { error: 'Could not delete note.' };
  }
}
