// app/lib/actions/bookmarks.js  (revalidation added)
'use server';

import { updateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { bookmarksStore } from '@/lib/data/bookmarks';

export async function createBookmark(prevState, formData) {
  const session = await getSession();
  if (!session?.user?.id) redirect('/sign-in');

  const url = formData.get('url')?.trim();
  const title = formData.get('title')?.trim() ?? url;
  if (!url) return { error: 'URL is required.' };

  await bookmarksStore.insert({ url, title, userId: session.user.id });

  updateTag('bookmarks');
  revalidatePath('/bookmarks');
  return { success: true };
}
