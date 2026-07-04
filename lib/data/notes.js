// lib/data/notes.js
import 'server-only';
import { cache } from 'react';
import fs from 'node:fs/promises';
import { NoteListSchema } from '@/lib/schemas';

async function readAll() {
  const raw = await fs.readFile('data/notes.json', 'utf8');
  return NoteListSchema.parse(JSON.parse(raw));
}

export const getAllNotes = cache(readAll);

export const getNote = cache(async (id) => {
  const notes = await getAllNotes(); // shares cache
  return notes.find((n) => n.id === id) ?? null;
});
