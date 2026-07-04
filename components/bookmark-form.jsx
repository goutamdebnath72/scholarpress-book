// components/bookmark-form.jsx
'use client'

import { useActionState } from 'react'
import { createBookmark } from '@/actions/bookmark'

export function BookmarkForm() {
  const [state, formAction, pending] = useActionState(createBookmark, {})

  return (
    <form action={formAction}>
      <input name="url" type="url" required placeholder="https://..." />
      <input name="title" placeholder="Title (optional)" />

      {state?.error && <p role="alert">{state.error}</p>}

      <button type="submit" disabled={pending}>
        {pending ? 'Adding...' : 'Add bookmark'}
      </button>
    </form>
  )
}
