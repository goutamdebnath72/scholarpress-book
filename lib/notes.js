// lib/notes.js
// Temporary in-memory store. Volume II replaces this
// module with a TypeORM repository; the function
// signatures stay the same so callers do not change.
const NOTES = [
  {
    id: '1',
    title: 'Reading list',
    content: 'Books to get through this quarter.',
  },
  {
    id: '2',
    title: 'Next.js notes',
    content: 'Server Components render on the server.',
  },
];

export function allNotes() {
  return NOTES;
}

export function getNote(id) {
  return NOTES.find((n) => n.id === id) ?? null;
}
