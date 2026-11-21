import type { TransitionDirectionalAnimations } from 'astro';

/**
 * Windows Phone “turnstile”: the old page swings away on a hinge at its left
 * edge, then the new page swings in. Going back plays it in reverse.
 * The keyframes live in src/styles/motion.css.
 */
const out = { duration: '0.2s', easing: 'cubic-bezier(0.55, 0, 0.9, 0.4)', fillMode: 'both' };
const into = { duration: '0.4s', easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)', fillMode: 'both' };

function turnstile(delay = 0.12): TransitionDirectionalAnimations {
  return {
    forwards: {
      old: { name: 'lv-turnstile-out', ...out },
      new: { name: 'lv-turnstile-in', ...into, delay: `${delay}s` },
    },
    backwards: {
      old: { name: 'lv-turnstile-out-back', ...out },
      new: { name: 'lv-turnstile-in-back', ...into, delay: `${delay}s` },
    },
  };
}

/** The main column. */
export const pageTurn = turnstile();

/** The sidebar follows a moment later, like the next tile in a feather. */
export const sideTurn = turnstile(0.2);

/**
 * Shared-element names: the same element on two pages gets the same name,
 * so it flies from one position to the other (Windows Phone “continuum”).
 */
export const shared = {
  title: (id: string) => `post-title-${id}`,
  cover: (id: string) => `post-cover-${id}`,
  date: (id: string) => `post-date-${id}`,
};
