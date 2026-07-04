// app/ui/link-spinner.js
'use client';

import { useLinkStatus } from 'next/link';

export default function LinkSpinner() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={pending ? 'link-spinner is-pending' : 'link-spinner'}
    >
      ○
    </span>
  );
}
