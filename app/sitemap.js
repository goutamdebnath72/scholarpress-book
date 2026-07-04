// app/sitemap.js
const BASE = 'https://scholarpress.com';

export default function sitemap() {
  // Notes are private and owner-scoped, so the
  // sitemap lists only the public entry points.
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE}/sign-in`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
