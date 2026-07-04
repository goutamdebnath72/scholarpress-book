// app/notes/[id]/opengraph-image.js
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { notesStore } from '@/lib/data/notes';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'ScholarPress note preview';

export default async function Image({ params }) {
  const note = await notesStore.findById((await params).id);
  const fontData = await readFile(
    join(process.cwd(), 'assets/Geist-SemiBold.ttf'),
  );

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 56,
          fontFamily: 'Geist',
          background: 'linear-gradient(135deg,#0070F3,#7928CA)',
          color: 'white',
          width: '100%',
          height: '100%',
          padding: 80,
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {note.title}
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Geist', data: fontData, weight: 600 },
      ],
    },
  );
}

