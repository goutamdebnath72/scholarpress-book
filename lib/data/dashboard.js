// lib/data/dashboard.js
import 'server-only';
import { cache } from 'react';
import { getAllNotes } from './notes';

export const getNoteCount = cache(async () => {
  const notes = await getAllNotes();
  return notes.length;
});

export const getRecentNotes = cache(async (limit = 5) => {
  const notes = await getAllNotes();
  return [...notes]
    .sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
});

export const getTopTags = cache(async (limit = 5) => {
  const notes = await getAllNotes();
  const counts = new Map();
  for (const note of notes)
    for (const tag of note.tags ?? [])
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, count }));
});

