// actions/bookmark.js
// Two Server Actions: create, delete
// Both: authenticate, validate, mutate, revalidate, return
"use server";

import * as Sentry from "@sentry/nextjs"; // Chapter 8
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getRepos } from "@/data-source";
import logger from "@/lib/logger"; // Chapter 8

export async function createBookmark(prevState, formData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/en/sign-in");

  const log = logger.child({
    requestId: (await headers()).get("x-request-id"),
    action: "createBookmark",
    userId: session.user.id,
  });

  const url = formData.get("url")?.trim();
  const title = formData.get("title")?.trim() ?? url;
  if (!url) return { error: "URL is required." };

  try {
    const { bookmarkRepo } = await getRepos();
    const bm = bookmarkRepo.create({ userId: session.user.id, url, title });
    await bookmarkRepo.save(bm);
    log.info({ bookmarkId: bm.id }, "Bookmark created");
    revalidatePath("/[lang]/bookmarks", "page");
    return { success: true };
  } catch (err) {
    log.error({ err }, "Failed to create bookmark");
    Sentry.captureException(err, { user: { id: session.user.id } });
    return { error: "Could not save bookmark. Please try again." };
  }
}

export async function deleteBookmark(bookmarkId) {
  const session = await auth();
  if (!session?.user?.id) redirect("/en/sign-in");

  const { bookmarkRepo } = await getRepos();
  // Ownership check: only the owner can delete
  const bm = await bookmarkRepo.findOne({
    where: { id: bookmarkId, userId: session.user.id },
  });
  if (!bm) return { error: "Not found or not yours." };

  try {
    await bookmarkRepo.remove(bm);
    revalidatePath("/[lang]/bookmarks", "page");
    return { success: true };
  } catch (err) {
    Sentry.captureException(err, { user: { id: session.user.id } });
    return { error: "Could not delete bookmark." };
  }
}
