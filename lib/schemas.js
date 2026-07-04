import { z } from 'zod';

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200),
  content: z.string(),
  tags: z.array(z.string()).max(10).optional(),
  createdAt: z.string().optional(),
});

export const BookmarkSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string().min(1).max(200),
  createdAt: z.string().optional(),
});

export const NoteListSchema = z.array(NoteSchema);

