// ============================================================
// PrintPadi – Navigation data
// Exact port of lib/navigation.ts from Next.js project
// ============================================================

type LinkSchema    = { name: string; link: string };
type ServiceSchema = LinkSchema & { image: string };

// ── Patterns for subpages that show the back-button top nav ──
// (mirrors SUBPAGE_TOP_NAV_PATTERNS)
export const SUBPAGE_TOP_NAV_PATTERNS = [
  /^\/search/,
  /^\/product\//,
  /^\/service\/request-quote/,
  /^\/service\/source-china/,
  /^\/cart\/summary/,
] as const;

export function isSubpageTopNavRoute(pathname: string): boolean {
  return SUBPAGE_TOP_NAV_PATTERNS.some(pattern => pattern.test(pathname));
}

/** Top-level site groups (Products / Lifestyle / StickerPadi) */
export const padiGroups: LinkSchema[] = [
  { name: 'products',     link: '/' },
  { name: 'lifestyle',    link: 'https://padilifestyle.com' },
  { name: 'stickerpadi', link: 'https://stickerpadi.com' },
];

/** Horizontal filter pills on home */
export const padiOffers: LinkSchema[] = [
  { name: 'all',                  link: '/' },
  { name: 'wedding',              link: '/products/wedding' },
  { name: 'business',             link: '/products/business' },
  { name: 'gifts',                link: '/products/gifts' },
  { name: 'events',               link: '/products/events' },
  { name: 'stickers',             link: '/products/stickers' },
  { name: 'packaging',            link: '/products/packaging' },
  { name: 'signages and display', link: '/search?tag=signages-and-display' },
];

/** Service chips row */
export const padiServices: ServiceSchema[] = [
  {
    name:  'curate an event',
    link:  '/service/curate-event',
    image: '/icons/services/curate-event.svg',
  },
  {
    name:  'request quote',
    link:  '/service/request-quote',
    image: '/icons/services/request-quote.svg',
  },
  {
    name:  'source from china',
    link:  '/service/source-china',
    image: '/icons/services/source-from-china.svg',
  },
  {
    name:  'Virtual Studio',
    link:  '/service/hire-designer',
    image: '/virtualshop.png',
  },
  {
    name:  'Printpadi AI',
    link:  '/service/shop-gifts',
    image: '/ai.png',
  },
];

/** Bottom tab bar links */
export const bottomNavLinks: LinkSchema[] = [
  { name: 'home',    link: '/home' },
  { name: 'explore', link: '/explore' },
  { name: 'my cart', link: '/cart' },
  { name: 'design',  link: '/design' },
  { name: 'profile', link: '/profile' },
];

/** Footer links */
export const footerLinks: LinkSchema[] = [
  { name: 'about us',            link: '/about' },
  { name: 'contact',             link: '/contact' },
  { name: 'track order',         link: '/tracking' },
  { name: 'stickerpadi',         link: 'https://stickerpadi.com' },
  { name: 'padilifestyle',       link: 'https://padilifestyle.com' },
  { name: 'terms and conditions',link: '/terms' },
  { name: 'privacy policy',      link: '/privacy-policy' },
  { name: 'shipping and delivery', link: '/shipping' },
  { name: 'careers',             link: '/careers' },
  { name: 'partnership',         link: '/partnership' },
];

/** Social links */
export const socials: LinkSchema[] = [
  { name: 'whatsapp',  link: 'https://whatsapp.com' },
  { name: 'instagram', link: 'https://instagram.com' },
  { name: 'x',         link: 'https://x.com' },
];
