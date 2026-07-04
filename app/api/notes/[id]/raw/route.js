// app/api/notes/[id]/raw/route.js
import { getSession } from '@/lib/session';
import { notesStore } from '@/lib/data/notes';

export async function GET(request, { params }) {
  const session = await getSession();
  if (!session?.user?.id) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const { id } = await params;
  const note = await notesStore.findOne(id, session.user.id);
  if (!note) {
    return new Response('Not found', { status: 404 });
  }

  const text = [
    `# ${note.title}`,
    '',
    note.content,
    '',
    `Tags: ${(note.tags ?? []).join(', ')}`,
  ].join('\n');

  return new Response(text, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition':
        `attachment; filename="note-${id}.txt"`,
    },
  });
}

