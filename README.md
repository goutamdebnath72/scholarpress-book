# ScholarPress

The companion application from *Next.js 16 with JavaScript* (Modern Tech Press).
A small notes-and-bookmarks app with Google sign-in, a Postgres database via
TypeORM, English/Bengali internationalisation, and an observability layer.

This repository is the **final, consolidated state** of the project as it stands
at the end of Volume II — assembled faithfully from the book's Appendix C
(§§ C.1–C.34) plus the supporting actions taught in the chapters.

---

## Project structure

```
scholarpress/
├── app/
│   ├── [lang]/                     locale-segment routes (en | bn)
│   │   ├── layout.js               root layout: shell + next-intl + nav
│   │   ├── globals.css
│   │   ├── page.js                 localized landing page
│   │   ├── sign-in/page.js         Google sign-in
│   │   ├── dashboard/page.js       auth-gated overview (parallel fetch)
│   │   ├── notes/
│   │   │   ├── page.js             notes list + full-text search
│   │   │   ├── new/page.js         create note
│   │   │   └── [id]/page.js        note detail (owner-scoped)
│   │   └── bookmarks/page.js       bookmarks list
│   └── api/auth/[...nextauth]/route.js   Auth.js HTTP handler
├── actions/
│   ├── note.js                     create / update / delete note
│   ├── bookmark.js                 create / delete bookmark
│   └── locale.js                   set NEXT_LOCALE cookie
├── components/
│   ├── note-card.jsx  note-form.jsx  note-search.jsx
│   ├── bookmark-card.jsx  bookmark-form.jsx
│   └── locale-switcher.jsx
├── entities/                       TypeORM EntitySchema: User, Note, Bookmark
├── lib/logger.js                   Pino logger
├── messages/                       en.json, bn.json (next-intl dictionaries)
├── migrations/                     initial schema (production path)
├── tests/                          vitest unit + playwright e2e
├── auth.js  auth.config.js         Auth.js v5 (Node + Edge split)
├── data-source.js                  TypeORM DataSource + repo exports
├── middleware.js                   locale negotiation + request id
├── next.config.js                  next-intl + Sentry plugins
├── i18n.js                         next-intl request config
├── jsconfig.json                   the @/* path alias
└── package.json
```

---

## Provenance — what comes from where

**Verbatim from the book (Appendix C and chapter listings):**
`auth.js`, `auth.config.js`, `data-source.js`, `middleware.js`, `next.config.js`,
all of `entities/`, `actions/note.js`, `actions/bookmark.js`, `actions/locale.js`,
`lib/logger.js`, every `app/[lang]/…` page, every `components/…`, `messages/*`,
`vitest.config.js`, `playwright.config.js`, `tests/*`, `.github/workflows/test.yml`,
`.env.production`.

**Authored to the book's specification** (described in prose / required to run,
but not listed verbatim in the book):
`package.json`, `jsconfig.json`, `i18n.js`, `app/[lang]/layout.js`,
`app/[lang]/globals.css`, `app/[lang]/dashboard/page.js`,
`migrations/1700000000000-InitialSchema.js`, `sentry.*.config.js`,
`.env.example`, `.gitignore`. These follow the patterns the book teaches; adjust
freely.

**Reconciliations made so the repo runs as one app:**
- `messages/en.json` / `bn.json` were valid book listings but (a) had a leading
  `//` comment that is illegal in real JSON — removed — and (b) lacked a few keys
  the Vol II pages reference (`home.*`, `signIn.*`, `notes.newTitle`,
  `notes.created`) — added.
- The multi-part book listings (`auth.config.js`, `actions/bookmark.js`,
  `actions/note.js`, `tests/unit/bookmark.test.js`, `.github/workflows/test.yml`)
  were re-joined into single files.

Every `@/…` import in the repo resolves to a real file, and every `.js`/`.jsx`
file passes a JSX-aware syntax parse (esbuild) and every `.json` parses.

---

## Running it on your Mac (VS Code)

> Requires **Node ≥ 20** and a **Postgres** database (local, or Supabase).

```bash
# 1. install dependencies
npm install

# 2. configure environment
cp .env.example .env.local
#    then edit .env.local:
#      DATABASE_URL       -> your Postgres connection string
#      AUTH_SECRET        -> run: npx auth secret
#      GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET  -> from Google Cloud Console
#         (authorised redirect URI: http://localhost:3000/api/auth/callback/google)

# 3. create the schema
#    In development, data-source.js runs with synchronize:true and creates the
#    tables on first connection — so you can usually skip migrations locally.
#    For the explicit/production path instead:
#      npm run migration:run

# 4. start the dev server
npm run dev
#    open http://localhost:3000/en
```

### Tests

```bash
npm test            # vitest unit tests
npx playwright install   # one-time, fetches browsers
npm run test:e2e    # playwright end-to-end
```

---

## Honest notes

- This environment could not run a live Next.js server, Postgres, or Google
  OAuth, so the repo has been verified by **static checks only**: every import
  resolves, every JS/JSX file parses, every JSON parses. The
  "it runs on my Mac" step is yours — if `npm run dev` or `next build` reports
  anything, send the error and it can be fixed quickly.
- Auth.js v5 and `next-intl` are pinned to the major versions the book targets;
  if you prefer exact lockstep versions, set them in `package.json` and re-`npm
  install`.
