// tests/unit/bookmark.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';

// The action authenticates, logs, mutates, and revalidates -- every one of those
// collaborators has to be mocked or the import fails outside a Next.js request.
const bookmarkRepo = {
  create: vi.fn(),
  save: vi.fn(),
  findOne: vi.fn(),
  remove: vi.fn(),
};

vi.mock('@/auth', () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: 'user-123' } }),
}));

// data-source exposes getRepos(), not the repositories directly.
vi.mock('@/data-source', () => ({
  getRepos: vi.fn().mockResolvedValue({ bookmarkRepo }),
}));

vi.mock('@/lib/logger', () => ({
  default: { child: () => ({ info: vi.fn(), error: vi.fn() }) },
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Map([['x-request-id', 'test-req']])),
}));

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));
vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn() }));

const { createBookmark, deleteBookmark } = await import('@/actions/bookmark');

describe('createBookmark', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a bookmark for the authenticated user', async () => {
    bookmarkRepo.create.mockReturnValue({ id: 'bm-1', userId: 'user-123' });
    bookmarkRepo.save.mockResolvedValue({ id: 'bm-1' });

    const formData = new FormData();
    formData.set('url', 'https://example.com');
    formData.set('title', 'Example');

    // Signature is (prevState, formData): this is a useActionState action.
    const result = await createBookmark({}, formData);

    expect(result.success).toBe(true);
    expect(bookmarkRepo.create).toHaveBeenCalledWith({
      userId: 'user-123',
      url: 'https://example.com',
      title: 'Example',
    });
  });

  it('rejects an empty URL before touching the database', async () => {
    const formData = new FormData();
    formData.set('url', '');

    const result = await createBookmark({}, formData);

    expect(result.error).toBe('URL is required.');
    expect(bookmarkRepo.save).not.toHaveBeenCalled();
  });

  it('returns a safe error message when the database throws', async () => {
    bookmarkRepo.create.mockReturnValue({});
    bookmarkRepo.save.mockRejectedValue(new Error('DB error'));

    const formData = new FormData();
    formData.set('url', 'https://example.com');

    const result = await createBookmark({}, formData);

    expect(result.error).toBeTruthy();
    // The real error must never reach the user.
    expect(result.error).not.toContain('DB error');
  });
});

// deleteBookmark was shipped without any unit test, leaving actions/bookmark.js
// lines 43-61 uncovered. That alone held total coverage under the 80% floor the
// book promises, so `vitest run --coverage` -- and therefore CI -- could not pass.
describe('deleteBookmark', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('refuses to delete a bookmark the user does not own', async () => {
    // Ownership is enforced by scoping the lookup to the session user, so a
    // bookmark belonging to someone else simply does not come back.
    bookmarkRepo.findOne.mockResolvedValue(null);

    const result = await deleteBookmark('bookmark-999');

    expect(result.error).toBe('Not found or not yours.');
    expect(bookmarkRepo.remove).not.toHaveBeenCalled();
  });

  it('deletes a bookmark the user owns', async () => {
    const bm = { id: 'bookmark-1', userId: 'user-123' };
    bookmarkRepo.findOne.mockResolvedValue(bm);
    bookmarkRepo.remove.mockResolvedValue(bm);

    const result = await deleteBookmark('bookmark-1');

    expect(result.success).toBe(true);
    expect(bookmarkRepo.remove).toHaveBeenCalledWith(bm);
  });

  it('returns a safe error message when the delete throws', async () => {
    bookmarkRepo.findOne.mockResolvedValue({ id: 'bookmark-1' });
    bookmarkRepo.remove.mockRejectedValue(new Error('DB exploded'));

    const result = await deleteBookmark('bookmark-1');

    expect(result.error).toBeTruthy();
    // The real error must never reach the user.
    expect(result.error).not.toContain('DB exploded');
  });
});
