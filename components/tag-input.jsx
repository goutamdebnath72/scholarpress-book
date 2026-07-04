// components/tag-input.jsx
'use client'

import { useState, useRef } from 'react'

// A chip/pill tag input. Type a tag and press Enter or comma to add it;
// click the × on a chip to remove it. Suggestions (tags you've used
// before) are passed in from the server and filtered as you type.
// The selected tags are mirrored into a hidden input named "tags" as a
// comma-separated string, so the surrounding <form> submits them with
// no extra client wiring.
export function TagInput({
  name = 'tags',
  suggestions = [],
  initial = [],
  hint = 'Type a tag and press comma or Enter — or paste a comma-separated list.',
}) {
  const [tags, setTags] = useState(initial)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  // Add one or more tags from a raw string. Splitting on commas (and
  // newlines, which sneak in from copied lists) is what lets a user type
  // OR paste "physics, mechanics" and get separate chips — the natural
  // ways people enter a tag list.
  const addTags = (raw) => {
    const incoming = raw
      .split(/[,\n]/)
      .map((t) => t.trim())
      .filter(Boolean)
    if (incoming.length === 0) {
      setDraft('')
      return
    }
    setTags((prev) => {
      const next = [...prev]
      for (const t of incoming) {
        // case-insensitive de-dupe against existing and just-added tags
        if (!next.some((x) => x.toLowerCase() === t.toLowerCase())) {
          next.push(t)
        }
      }
      return next
    })
    setDraft('')
  }

  const removeTag = (t) => setTags(tags.filter((x) => x !== t))

  const onChange = (e) => {
    const v = e.target.value
    // If the user typed (or pasted) a comma, commit everything up to the
    // last comma as chips and keep any trailing text as the new draft.
    if (v.includes(',')) {
      const lastComma = v.lastIndexOf(',')
      addTags(v.slice(0, lastComma))
      setDraft(v.slice(lastComma + 1).trimStart())
    } else {
      setDraft(v)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTags(draft)
    } else if (e.key === 'Backspace' && !draft && tags.length) {
      // Backspace on an empty field removes the last chip.
      removeTag(tags[tags.length - 1])
    }
  }

  // Paste path. Whether the clipboard holds "a, b, c", "a,b,c", or a
  // newline-separated list, commit EVERY piece as a chip — including the
  // last one — so nothing is left dangling in the input. If the paste has
  // no separators at all (a single tag), fall through to normal typing so
  // the user can keep editing it before committing.
  const onPaste = (e) => {
    const text = e.clipboardData.getData('text')
    if (/[,\n]/.test(text)) {
      e.preventDefault()
      addTags(`${draft}${text}`)
    }
  }

  const shown = suggestions
    .filter((s) => s.toLowerCase().includes(draft.toLowerCase()))
    .filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()))
    .slice(0, 6)

  return (
    <div className="tag-field">
      <div className="tag-chips" onClick={() => inputRef.current?.focus()}>
        {tags.map((t) => (
          <span key={t} className="tag-chip">
            {t}
            <button
              type="button"
              className="tag-chip-x"
              aria-label={`Remove ${t}`}
              onClick={() => removeTag(t)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className="tag-draft"
          value={draft}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onBlur={() => addTags(draft)}
          placeholder={tags.length ? '' : 'Add tags…'}
        />
      </div>

      {hint && <p className="tag-hint">{hint}</p>}

      {draft && shown.length > 0 && (
        <ul className="tag-suggest">
          {shown.map((s) => (
            <li key={s}>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); addTags(s) }}>
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Hidden field the form actually submits */}
      <input type="hidden" name={name} value={tags.join(',')} />
    </div>
  )
}
