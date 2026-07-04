// lib/data/dashboard.js  (cached widget)
import { cacheLife, cacheTag } from 'next/cache';
import { getAllNotes } from './notes';

export async function getCachedTopTags(limit = 5) {
  'use cache';
  cacheLife('hours');
  cacheTag('notes');
  const notes = await getAllNotes();
  const counts = new Map();
  for (const note of notes)
    for (const tag of note.tags ?? [])
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}
