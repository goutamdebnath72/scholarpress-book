# RENDERING.md — ScholarPress rendering plan

Route                       Strategy          Reason
--------------------------- ----------------- -----------------------------
/                           SSG               No request data; copy is fixed.
/notes                      PPR + Suspense    Shell static; list streams.
/notes/[id]                 PPR + 'use cache' Note text cached per id; edit
                                              actions revalidate the path.
/notes/new                  SSR               Form needs the session cookie.
/bookmarks                  PPR + Suspense    Shell static; list streams.
/dashboard                  PPR + Suspense    Shell static; per-user widgets
                                              stream from the data layer.
/api/health                 SSR               Reads build env every request.
/api/notes/[id]/raw         SSR               Reads cookies for auth.
/api/webhooks/revalidate    SSR               POST receiver; never cached.
