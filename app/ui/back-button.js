// app/ui/back-button.js
'use client';

import { useRouter } from 'next/navigation';

export default function BackButton({ children }) {
  const router = useRouter();
  return (
    <button onClick={() => router.back()}>
      ← {children}
    </button>
  );
}
