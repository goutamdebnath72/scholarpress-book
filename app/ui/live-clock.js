// app/ui/live-clock.js
'use client';

import { useEffect, useState } from 'react';

// A tiny browser-only clock. It exists to prove the
// client runtime is live on the landing page; later
// chapters replace it with real interactive UI.
export default function LiveClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <p>
      Browser clock:{' '}
      <code>{now ? now.toISOString() : '…'}</code>
    </p>
  );
}
