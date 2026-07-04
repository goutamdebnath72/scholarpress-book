// lib/schemas/actions.js
import { z } from 'zod';

export const CreateNoteInput = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().default(''),
  tags: z.array(z.string()).max(10).optional(),
});

export const UpdateNoteInput = CreateNoteInput.extend({
  id: z.string(),
});

export const CreateBookmarkInput = z.object({
  url: z.string().url(),
  title: z.string().optional(),
});
