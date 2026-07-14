// tests/e2e/fixtures.js
import { test as base } from '@playwright/test';

// Extend Playwright's test with an authenticated page fixture.
// Usage: import { test } from './fixtures' in any e2e test file.
//
// ScholarPress signs in through GitHub OAuth, so a browser cannot complete the flow
// unattended. The app therefore enables a credentials provider when E2E === '1'
// (Chapter 4), and this fixture drives that instead of the OAuth dance.
export const test = base.extend({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page    = await context.newPage();

    await page.goto('/en/sign-in');
    // The E2E credentials provider takes a single email and returns a session
    // for it (Chapter 4 §4.9). No OAuth round-trip.
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 10_000 });

    await use(page);

    await context.close();
  },
});
