// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config.ts';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // The address lives in src/site.config.ts so it only changes in one place.
  site: SITE.url,
  // One URL per page: always with a trailing slash (/about/), the form
  // Cloudflare Pages serves. This keeps canonical links consistent.
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Search results are not content; keep them out of the sitemap.
      filter: (page) => !page.includes('/search/'),
    }),
  ],
});
