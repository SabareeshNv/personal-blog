/**
 * Site-wide settings. Change these values instead of editing components.
 */
export const SITE = {
  title: 'Lone Voice',
  /** Shown under the large title on the homepage. */
  tagline: 'ideas half formed, feelings half named.',
  /** Used for search engines and the RSS feed. */
  description: 'lone voice | a personal blog for feelings and thoughts worth jotting down.',
  /** The text in the accent tile at the top of the homepage sidebar. */
  intro: 'a quiet personal space for feelings and thoughts worth jotting down.',
  /**
   * The site's address. Canonical links, the sitemap, robots.txt, RSS and
   * structured data all use it. Change it here when the domain changes.
   */
  url: 'https://lonevoice.pages.dev',
  /** Who publishes the site (the blog stays anonymous, so the site name). */
  publisher: 'Lone Voice',
  /** Default image for link previews (1200×630, in public/). */
  socialImage: '/og-default.jpg',
  lang: 'en',
  locale: 'en-IN',
  /** Dates are shown in this time zone, whatever the reader's own. */
  timeZone: 'Asia/Kolkata',
  /** Posts per page on the homepage. */
  pageSize: 10,
  /** Year shown in the footer copyright line. */
  copyrightYear: 2026,
} as const;

/** The pivot menu, in order. `match` is the first URL segment that marks it current. */
export const NAV = [
  { label: 'posts', href: '/', match: '' },
  { label: 'topics', href: '/topics/', match: 'topics' },
  { label: 'archive', href: '/archive/', match: 'archive' },
  { label: 'about', href: '/about/', match: 'about' },
] as const;

export const LEGAL_LINKS = [
  { label: 'Content Policy', href: '/content-policy/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
] as const;
