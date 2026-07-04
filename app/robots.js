// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/notes/', '/dashboard/'],
      },
    ],
    sitemap: 'https://scholarpress.com/sitemap.xml',
  };
}
