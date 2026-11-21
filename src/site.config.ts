/**
 * Site-wide settings. Change these values instead of editing components.
 */
export const SITE = {
  title: 'Lone Voice',
  /** Shown under the large title on the homepage. */
  tagline: 'short notes, written down.',
  /** Used for search engines and the RSS feed. */
  description: 'Lone Voice: short notes, links and photos, newest first.',
  /** The text in the accent tile at the top of the homepage sidebar. */
  intro: 'A quiet place for short notes on things worth writing down.',
  url: 'https://lonevoice.pages.dev',
  lang: 'en',
  locale: 'en-GB',
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
