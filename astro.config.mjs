// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // Production URL: used for canonical links, the RSS feed and the sitemap.
  site: 'https://lonevoice.pages.dev',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
});
