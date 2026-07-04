// tests/e2e/fixtures.js
import { test as base } from '@playwright/test'
import { AppDataSource } from '../../data-source'

// Extend Playwright's test with an authenticated page fixture.
// Usage: import { test } from './fixtures' in any e2e test file.
export const test = base.extend({
  authenticatedPage: async ({ browser }, use) => {
    // Initialise DB if not already done
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }

    // Insert a test user directly (bypasses OAuth)
    const user = await AppDataSource.getRepository('User').save({
      email:  'playwright@test.local',
      name:   'Playwright User',
      role:   'viewer',
      locale: 'en',
    })

    // Sign in via the UI and capture session cookies
    const context = await browser.newContext()
    const page    = await context.newPage()
    await page.goto('/en/sign-in')
    await page.getByLabel('Email').fill(user.email)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL('/en/dashboard', { timeout: 10_000 })

    await use(page)

    // Teardown: remove test user and close context
    await AppDataSource.getRepository('User').delete({ id: user.id })
    await context.close()
  },
})
