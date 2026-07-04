// components/note-search.jsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useState, useTransition }                from 'react'

export function NoteSearch({ placeholder }) {
  const router   = useRouter()
  const pathname = usePathname()
  const params   = useSearchParams()
  const [value, setValue]   = useState(params.get('q') ?? '')
  const [pending, start]    = useTransition()

  function onChange(next) {
    setValue(next)
    const qs = new URLSearchParams(params)
    if (next) qs.set('q', next)
    else      qs.delete('q')
    // Transition keeps the input responsive while the server
    // re-renders the list with the new query.
    start(() => router.replace(`${pathname}?${qs}`))
  }

  return (
    <input
      type="search"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      aria-busy={pending}
    />
  )
}
