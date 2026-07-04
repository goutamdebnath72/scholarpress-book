// app/api/webhooks/revalidate/route.js
import { revalidatePath } from 'next/cache';
import { createHmac, timingSafeEqual } from 'node:crypto';

function verify(secret, rawBody, signatureHeader) {
  if (!signatureHeader) return false;
  const expected = createHmac('sha256', secret)
    .update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHeader);
  // Lengths must match before timingSafeEqual.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request) {
  const raw = await request.text(); // exact bytes
  const sig = request.headers.get('x-signature');
  const secret = process.env.WEBHOOK_SECRET;

  if (!secret || !verify(secret, raw, sig)) {
    return new Response('Invalid signature', { status: 401 });
  }

  const { paths = [] } = JSON.parse(raw);
  for (const path of paths) revalidatePath(path);

  return Response.json({ revalidated: paths, now: Date.now() });
}

