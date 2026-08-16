const BASE = process.env.APP_URL || 'https://chachapride.example.com';

const STATIC_ROUTES = [
  '',
  '/about',
  '/contact',
  '/safety',
  '/fares',
  '/help',
  '/business',
  '/drive-with-us',
  '/terms',
  '/privacy',
  '/login',
  '/signup',
];

export default function sitemap() {
  return STATIC_ROUTES.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.7,
  }));
}
