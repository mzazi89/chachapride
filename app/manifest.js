export default function manifest() {
  return {
    name: 'chachapride — Rides',
    short_name: 'chachapride',
    description: 'Safe, affordable ride-hailing in Kenya — book, pay, and track your driver in real time.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f8fafc',
    theme_color: '#2563eb',
    categories: ['transportation', 'travel'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
