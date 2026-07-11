// lib/format.js — shared Intl formatting utilities

export function formatNoteDate(dateString, locale) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// formatNoteDate('2024-06-15', 'en') => 'June 15, 2024'
// formatNoteDate('2024-06-15', 'bn') => '১৫ জুন, ২০২৪'

export function formatCount(n, locale) {
  return new Intl.NumberFormat(locale).format(n);
}

// formatCount(1234, 'en') => '1,234'
// formatCount(1234, 'bn') => '১,২৩৪'

export function formatRelativeTime(dateString, locale) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto', // 'yesterday' not '-1 day'
  });

  if (diffSec < 60) return rtf.format(-diffSec, 'second');
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  if (diffHour < 24) return rtf.format(-diffHour, 'hour');
  if (diffDay < 30) return rtf.format(-diffDay, 'day');
  // Fall back to absolute date for older notes
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// formatRelativeTime('2024-06-12T10:00:00Z', 'en') => '3 days ago'
// formatRelativeTime('2024-06-12T10:00:00Z', 'bn') => '৩ দিন আগে'

export function formatCurrency(amount, locale, currency = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    // No decimal places for whole amounts (optional)
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(ratio, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(ratio);
}

// formatCurrency(1250, 'en', 'USD')   => '$1,250'
// formatCurrency(1250, 'bn-BD', 'BDT') => '৳১,২৫০'  (Bengali digits, Taka)
// formatPercent(0.847, 'en')  => '84.7%'
// formatPercent(0.847, 'bn')  => '৮৪.৭%'  (Bengali digits)
