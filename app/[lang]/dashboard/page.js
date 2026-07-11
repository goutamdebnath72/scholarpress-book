// app/[lang]/dashboard/page.js
// Server Component — auth-gated overview with parallel data fetching.
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getRepos } from '@/data-source';

export default async function DashboardPage({ params }) {
  const { lang } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${lang}/sign-in`);

  const t = await getTranslations({ locale: lang });
  const userId = session.user.id;

  const { noteRepo, bookmarkRepo } = await getRepos();

  // Independent queries run concurrently — each starts at t=0.
  const [noteCount, bookmarkCount, recentNotes, recentBookmarks] =
    await Promise.all([
      noteRepo.count({ where: { userId } }),
      bookmarkRepo.count({ where: { userId } }),
      noteRepo.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 20,
      }),
      bookmarkRepo.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        take: 20,
      }),
    ]);

  return (
    <section className="dashboard-wide">
      <h1>{t('auth.welcome', { name: session.user.name ?? '' })}</h1>
      <p>
        {noteCount} notes · {bookmarkCount} bookmarks
      </p>

      <div className="dash-grid">
        {/* Notes column */}
        <div className="dash-col">
          <h2>{t('notes.title')}</h2>
          <div className="dash-scroll">
            {recentNotes.length === 0 ? (
              <p className="dash-empty">{t('notes.empty')}</p>
            ) : (
              <ul className="dash-list">
                {recentNotes.map((n) => (
                  <li key={n.id}>
                    <a href={`/${lang}/notes/${n.id}`} title={n.title}>
                      {n.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Bookmarks column */}
        <div className="dash-col">
          <h2>{t('bookmarks.title')}</h2>
          <div className="dash-scroll">
            {recentBookmarks.length === 0 ? (
              <p className="dash-empty">{t('bookmarks.empty')}</p>
            ) : (
              <ul className="dash-list">
                {recentBookmarks.map((b) => (
                  <li key={b.id}>
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={b.title ?? b.url}
                    >
                      {b.title ?? b.url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
