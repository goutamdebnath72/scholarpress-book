// app/[lang]/bookmarks/page.js
// Identical structure to notes/page.js: auth check, fetch, render.
// Key difference: no full-text search — bookmarks are title+URL only.
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getRepos } from "@/data-source";
import { getTranslations } from "next-intl/server";
import { BookmarkCard } from "@/components/bookmark-card";
import { BookmarkForm } from "@/components/bookmark-form";

export default async function BookmarksPage({ params }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/en/sign-in");

  const { lang } = await params;
  const t = await getTranslations({ locale: lang });

  const { bookmarkRepo } = await getRepos();
  const bookmarks = await bookmarkRepo.find({
    where: { userId: session.user.id },
    order: { createdAt: "DESC" },
  });

  return (
    <main>
      <h1>{t("bookmarks.title")}</h1>
      {/* BookmarkForm is a Client Component — uses useFormState */}
      <BookmarkForm />
      {bookmarks.length === 0 ? (
        <p>{t("bookmarks.empty")}</p>
      ) : (
        <ul>
          {bookmarks.map((bm) => (
            <BookmarkCard key={bm.id} bookmark={bm} lang={lang} />
          ))}
        </ul>
      )}
    </main>
  );
}
