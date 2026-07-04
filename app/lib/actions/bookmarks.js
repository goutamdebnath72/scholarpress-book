// app/lib/actions/bookmarks.js
'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { bookmarksStore } from '@/lib/data/bookmarks';
import { CreateBookmarkInput } from '@/lib/schemas/actions';

export async function createBookmark(prevState, formData) {
  const session = await getSession();
  if (!session?.user?.id) redirect('/sign-in');

  const url = formData.get('url')?.trim();
  const title = formData.get('title')?.trim() ?? url;
  const parsed = CreateBookmarkInput.safeParse({ url, title });
  if (!parsed.success) return { error: 'A valid URL is required.' };

  await bookmarksStore.insert({
    url: parsed.data.url,
    title: parsed.data.title ?? parsed.data.url,
    userId: session.user.id,
  });
  revalidatePath('/bookmarks');
  return { success: true };
}
