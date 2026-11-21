import type { TransitionDirectionalAnimations } from 'astro';

/**
 * Windows Phone “turnstile”: the new page swings in on a hinge at its left
 * edge; going back it swings in from the other side.
 *
 * The old page only fades out, quickly and without moving: rotating a whole
 * column of text makes its lines streak across a phone screen.
 * The keyframes live in src/styles/motion.css.
 */
const out = { name: 'lv-fade-out', duration: '0.12s', easing: 'linear', fillMode: 'both' };
const into = { duration: '0.4s', easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)', fillMode: 'both' };

function turnstile(delay = 0.08): TransitionDirectionalAnimations {
  return {
    forwards: {
      old: out,
      new: { name: 'lv-turnstile-in', ...into, delay: `${delay}s` },
    },
    backwards: {
      old: out,
      new: { name: 'lv-turnstile-in-back', ...into, delay: `${delay}s` },
    },
  };
}

/** The main column. */
export const pageTurn = turnstile();

/** The sidebar follows a moment later, like the next tile in a feather. */
export const sideTurn = turnstile(0.16);

/**
 * Shared-element names: the same element on two pages gets the same name,
 * so it flies from one position to the other (Windows Phone “continuum”).
 */
export const shared = {
  title: (id: string) => `post-title-${id}`,
  cover: (id: string) => `post-cover-${id}`,
  date: (id: string) => `post-date-${id}`,
};
