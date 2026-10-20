import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL?.trim() || 'https://enterprise-it-fixes.pages.dev';

export default defineConfig({
  output: 'static',
  site,
});
