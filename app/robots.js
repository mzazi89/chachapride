const BASE = process.env.APP_URL || 'https://chachapride.example.com';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/profile', '/history', '/payment/'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
