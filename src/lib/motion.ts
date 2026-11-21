/**
 * Motion settings shared by MotionDirector.astro and the components.
 * The animations themselves are drawn in src/styles/motion.css.
 */

/** The menu sections in order; moving between them is a sideways pivot. */
const SECTION_PATHS = ['/', '/topics/', '/archive/', '/about/'];

/** Position of a URL in the menu, or undefined if it isn't a section page. */
export function sectionIndex(url: URL): number | undefined {
  const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  if (/^\/\d+\/$/.test(path)) return 0; // homepage, page 2, 3…
  const index = SECTION_PATHS.indexOf(path);
  return index === -1 ? undefined : index;
}

export type Motion = 'pivot-next' | 'pivot-prev' | 'turnstile';

/** Pivot between two different menu sections; turnstile for everything else. */
export function motionFor(from: URL, to: URL): Motion {
  const a = sectionIndex(from);
  const b = sectionIndex(to);
  if (a !== undefined && b !== undefined && a !== b) return b > a ? 'pivot-next' : 'pivot-prev';
  return 'turnstile';
}

/** Turnstile exit: each visible item swings away on its left-edge hinge. */
export const EXIT = {
  duration: 265,
  stagger: 53,
  /** Items after this many leave together, so the exit stays short. */
  maxStagger: 6,
  angle: 80,
  easing: 'cubic-bezier(0.55, 0, 0.9, 0.4)',
};

/** Continuum: the tapped title lifts slightly before it flies. */
export const LIFT = {
  duration: 160,
  transform: 'translateY(-0.4rem) scale(1.03)',
  easing: 'cubic-bezier(0.2, 0, 0.4, 1)',
};

/**
 * Shared-element names: the same element on two pages gets the same name,
 * so it flies from one position to the other (continuum).
 */
export const shared = {
  title: (id: string) => `post-title-${id}`,
  cover: (id: string) => `post-cover-${id}`,
  date: (id: string) => `post-date-${id}`,
};
