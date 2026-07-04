// tests/unit/bookmark.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createBookmark } from '@/actions/bookmark'

// Mock the database repository
vi.mock('@/data-source', () => ({
  bookmarkRepo: {
    create: vi.fn(),
    save:   vi.fn(),
  }
}))

// Mock auth to return a known session
vi.mock('@/auth', () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: 'user-123' }
  })
}))

describe('createBookmark', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('creates a bookmark for the authenticated user', async () => {
    const { bookmarkRepo } = await import('@/data-source')
    bookmarkRepo.create.mockReturnValue({ id: 'bm-1', userId: 'user-123' })
    bookmarkRepo.save.mockResolvedValue({ id: 'bm-1' })

    const formData = new FormData()
    formData.set('url', 'https://example.com')
    formData.set('title', 'Example')

    const result = await createBookmark(formData)

    expect(result.success).toBe(true)
    expect(bookmarkRepo.create).toHaveBeenCalledWith({
      userId: 'user-123',
      url:    'https://example.com',
      title:  'Example',
    })
  })

  it('returns an error message when the database throws', async () => {
    const { bookmarkRepo } = await import('@/data-source')
    bookmarkRepo.create.mockReturnValue({})
    bookmarkRepo.save.mockRejectedValue(new Error('DB error'))

    const formData = new FormData()
    formData.set('url', 'https://example.com')

    const result = await createBookmark(formData)

    expect(result.error).toBeTruthy()
    // Must not expose the real error message
    expect(result.error).not.toContain('DB error')
  })
})
