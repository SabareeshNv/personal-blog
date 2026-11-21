import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Every post lives in `src/content/posts/` as a Markdown file.
 *
 * Only `date` is required. A post can also have, in any combination:
 * - `title`        — makes it a titled post; without one it is a short note
 * - `cover`        — an image beside the text on the timeline, or full width
 *                    when the post has no title (a photo post)
 * - `tags`         — topics, shown under the post and on /topics/
 * - `description`  — a summary used on the timeline instead of an excerpt
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z
      .object({
        date: z.coerce.date(),
        title: z.string().optional(),
        description: z.string().optional(),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        tags: z.array(z.string()).default([]),
        /** Keep this post in the sidebar's “pinned” slot. */
        pinned: z.boolean().default(false),
        /** Drafts appear only in `npm run dev`. */
        draft: z.boolean().default(false),
      })
      .refine((data) => !data.cover || Boolean(data.coverAlt), {
        message: 'A cover image needs `coverAlt` text for screen readers.',
        path: ['coverAlt'],
      }),
});

export const collections = { posts };
