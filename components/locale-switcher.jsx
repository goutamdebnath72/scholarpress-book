// components/locale-switcher.jsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { setLocale } from '@/actions/locale';

const LOCALES = { en: 'English', bn: 'বাংলা' };

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Derive current locale from the URL prefix
  const current = pathname.startsWith('/bn') ? 'bn' : 'en';
  const next = current === 'en' ? 'bn' : 'en';

  async function handleSwitch() {
    await setLocale(next);
    // Replace current locale prefix in the path
    const newPath = pathname.replace(/^\/(en|bn)/, `/${next}`);
    router.replace(newPath);
  }

  return (
    <button onClick={handleSwitch} aria-label={`Switch to ${LOCALES[next]}`}>
      {LOCALES[next]}
    </button>
  );
}
