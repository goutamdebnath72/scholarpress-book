// tests/factories.js — test data factories
import { AppDataSource } from '../data-source';

export async function createTestUser(overrides = {}) {
  const repo = AppDataSource.getRepository('User');
  return repo.save({
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    role: 'viewer',
    locale: 'en',
    ...overrides,
  });
}

export async function createTestNote(userId, overrides = {}) {
  const repo = AppDataSource.getRepository('Note');
  return repo.save({
    userId,
    title: 'Test Note',
    content: 'Test content',
    isPublished: false,
    ...overrides,
  });
}

// Usage in a test:
// const user     = await createTestUser({ role: 'publisher' })
// const note     = await createTestNote(user.id, { isPublished: true })
// const { id }   = await createTestBookmark(user.id, { url: 'https://example.com' })
