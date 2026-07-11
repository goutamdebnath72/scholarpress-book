// components/NoteCount.js
import { useTranslations } from 'next-intl';

export function NoteCount({ count }) {
  const t = useTranslations();
  // next-intl passes 'count' to the ICU message automatically
  return <p>{t('noteCount', { count })}</p>;
}

// Renders in English:  '3 notes'
// Renders in Bengali:  '৩টি নোট'  (Bengali digits, classifier)
