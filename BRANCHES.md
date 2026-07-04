# ScholarPress — per-chapter branches

This repository ships the **finished ScholarPress app on `main`**. In addition,
the two books (*Next.js 16 with JavaScript*, Volumes I and II) build the app
step by step, and — as the preface promises — each chapter's end state is
captured on its own branch so you can check out the project as it stood at the
end of any chapter.

## Branch list

**Volume I (Layer II onward) — the teaching build**
`ch11-end` → `ch12-end` → … → `ch28-end`

**Volume II (Integration & Production) — converging on the finished app**
`v2-ch1-end` → `v2-ch2-end` → … → `v2-ch8-end`

The branches form a single linear chain: each builds on the one before it, and
`v2-ch8-end` is the finished application (identical to `main`).

## Important: these branches are for **inspection, not execution**

- The `ch*-end` (Volume I) branches mirror the code **exactly as printed in the
  book** at the end of each chapter. Volume I deliberately teaches a simplified
  build — in-memory / JSON data, stubbed sessions, routes without the `[lang]`
  prefix — so the reader meets one idea at a time. These snapshots are meant to
  be **read alongside the book**, not run. A partially built chapter does not
  `npm run dev` on its own, by design.

- The `v2-ch*-end` (Volume II) branches show the app progressively integrating
  real infrastructure (GitHub auth, TypeORM + Supabase, internationalization,
  testing, deployment, observability), converging on the production app.

- **`main` is the finished, runnable application.** Where the book's teaching
  build and the final app differ — for example the book teaches `proxy.js`
  while the shipped app keeps `middleware.js` (it runs Auth.js on the Edge
  runtime, which `proxy.js` cannot) — **`main` is the source of truth for the
  final product**, and the book chapters are the source of truth for the
  teaching progression.

To run the app, use `main`. To follow the book, check out the matching branch
and read.
