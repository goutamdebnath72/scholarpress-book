// tests/e2e/notes.test.js
//
// Run with `npx playwright test`, not `npm test`: vitest.config.js excludes
// tests/e2e/, because Playwright's test() cannot run inside Vitest.
import { test } from './fixtures'; // authenticated page fixture
import { expect } from '@playwright/test';

test('can create and view a note', async ({ authenticatedPage: page }) => {
  await page.goto('/en/notes/new');
  await page.getByLabel('Title').fill('Test Note');
  await page.getByLabel('Content').fill('This is test content.');
  await page.getByRole('button', { name: 'Save note' }).click();

  // After saving, the app redirects to the notes list
  await page.waitForURL('**/en/notes');

  await expect(page.getByRole('heading', { name: 'Test Note' })).toBeVisible();
});

// The ownership check is the most important test in the suite from a security
// point of view: a note belonging to one user must not be reachable by another.
//
// It needs two authenticated browser contexts, and the fixture in ./fixtures.js
// provides one. Writing it as a stub that opens two contexts, closes them and
// asserts nothing would report green while testing nothing at all -- worse than
// having no test, because it looks like coverage.
//
// The unit test in tests/unit/bookmark.test.js already covers the same rule at
// the Server Action level ('returns a safe error message when the database
// throws', and the ownership check in actions/bookmark.js). Implement this one
// when a second authenticated fixture exists.
test.fixme('cannot access notes created by another user', async () => {
  // Sign in as user A, create a note, capture its id.
  // Sign in as user B in a second context, request /en/notes/<id>.
  // Expect a 404 or a redirect to sign-in -- never the note's content.
});
