// lib/data/notes.js
import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';

async function readAll() {
  const filepath = path.join(
    process.cwd(), 'data', 'notes.json'
  );
  const raw = await fs.readFile(filepath, 'utf8');
  return JSON.parse(raw);
}

export async function getAllNotes() {
  return await readAll();
}

export async function getNote(id) {
  const all = await readAll();
  return all.find((n) => n.id === id) ?? null;
}

