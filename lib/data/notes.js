// lib/data/notes.js  (cached read)
import { cacheLife, cacheTag } from 'next/cache';
import { notesStore } from '@/lib/data/notes-store';

export async function getCachedNote(id) {
  'use cache';
  cacheLife('hours');
  cacheTag(`note-${id}`);
  return notesStore.findById(id);
}
