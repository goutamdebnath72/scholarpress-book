# Errata — *Next.js 16 with JavaScript*

Corrections and post-publication notes for both volumes of
*Next.js 16: Mechanism & Mastery* (JavaScript Edition).

- **Volume I** — Foundations (Chapters 1–28)
- **Volume II** — Integration & Production (Chapters 1–8, Appendices A–F)

Companion source: <https://github.com/goutamdebnath72/scholarpress-book>
The project as it stands at the end of any chapter is on the matching
`chNN-end` / `v2-chN-end` branch (see `BRANCHES.md`).

---

## How to report an error

If you find a mistake — a typo, a code listing that doesn't run, an
explanation that misleads, or a place where a newer Next.js release has
changed the described behaviour — please **open an issue**:

<https://github.com/goutamdebnath72/scholarpress-book/issues/new?labels=errata>

Include, where you can:

- **Volume and chapter** (e.g. "Vol I, Ch 19")
- **Page or listing number** (e.g. "p. 468, Listing 19.15")
- **What's printed** and **what it should say**

Confirmed corrections are recorded in the tables below, with credit to the
reader who reported them (unless you'd rather not be named).

---

## Version targets

These books target **Next.js 16.x** and **React 19.2**. The companion
ScholarPress source is pinned to **Next.js 16.2.6** at manuscript freeze.
Where a later 16.x release shifts behaviour materially, a note is added to
the *Version-drift notes* section for the affected volume rather than to the
corrections table — the printed text was correct for 16.2.6.

---

## Volume I — corrections

No corrections recorded yet. This section will list confirmed errata as they
are reported and verified.

| Chapter | Page / Listing | Correction | Reported | Fixed |
|:-------:|:---------------|:-----------|:---------|:-----:|
| —       | —              | *(none yet)* | —      | —     |

### Volume I — version-drift notes

*Behaviour changes in Next.js releases after 16.2.6 that affect the text.*

| Since | Chapter | Note |
|:-----:|:-------:|:-----|
| —     | —       | *(none yet)* |

---

## Volume II — corrections

No corrections recorded yet. This section will list confirmed errata as they
are reported and verified.

| Chapter | Page / Listing | Correction | Reported | Fixed |
|:-------:|:---------------|:-----------|:---------|:-----:|
| —       | —              | *(none yet)* | —      | —     |

### Volume II — version-drift notes

| Since | Chapter | Note |
|:-----:|:-------:|:-----|
| —     | —       | *(none yet)* |

---

## Known editorial notes

These are intentional differences readers sometimes ask about — not errors:

- **`proxy.js` vs `middleware.js`.** Volume I, Chapter 28 teaches the Next.js 16
  `proxy.js` rename, and the `chNN-end` teaching branches ship `proxy.js`. The
  finished application on `main` keeps `middleware.js`, because it runs Auth.js
  on the Edge runtime, which the Node-only `proxy.js` cannot. Both are correct
  for their context; see `BRANCHES.md`.
- **Teaching branches are for inspection, not execution.** The `chNN-end` and
  `v2-chN-end` branches mirror the code exactly as printed at the end of each
  chapter. `main` is the finished, runnable app.

---

*Last updated: on publication. Errors that remain are the author's;
corrections are welcomed and appreciated.*
