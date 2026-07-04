// app/ui/layout-counter.js
'use client';

import { useState } from 'react';

export default function LayoutCounter() {
  const [n, setN] = useState(0);
  return (
    <button onClick={() => setN(n + 1)}>
      clicked {n} times
    </button>
  );
}
