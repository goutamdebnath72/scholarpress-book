// tests/e2e/seed.js
//
// Insert the E2E user before Playwright runs.
//
// The credentials provider (auth.config.js, Ch 4 §4.9) returns a FIXED uuid for
// the test user. That id lands in the JWT, then in session.user.id, and every
// query filters on it -- notes.userId, tags.userId and bookmarks.userId are all
// uuid columns with a foreign key to users.id.
//
// So the row has to exist. Without it the first page load dies with
//     invalid input syntax for type uuid
// (if the id is not a uuid) or the first note insert dies on the FK
// (if the id is a uuid but no such user).
//
// Run with:  node tests/e2e/seed.js
import 'reflect-metadata';
import { AppDataSource } from '../../data-source.js';
import { E2E_USER_ID } from '../../auth.config.js';

const ds = await AppDataSource.initialize();

await ds.query(
  `INSERT INTO users (id, email, name, role, locale)
   VALUES ($1, $2, $3, 'viewer', 'en')
   ON CONFLICT (id) DO NOTHING`,
  [E2E_USER_ID, 'test@example.com', 'E2E Test User'],
);

const [{ count }] = await ds.query(
  'SELECT COUNT(*)::int AS count FROM users WHERE id = $1',
  [E2E_USER_ID],
);
console.log(`E2E user seeded (${E2E_USER_ID}) — rows: ${count}`);

await ds.destroy();
