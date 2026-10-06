import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import remarkReferentielPpc from './src/lib/remark-referentiel-ppc.ts';

export default defineConfig({
  output: 'static',
  site: 'https://www.perennite-programmee-circulaire.org',
  redirects: {
    '/nous-soutenir-adhesion': '/association/nous-soutenir/',
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return (
          pathname !== '/admin'
          && !pathname.startsWith('/admin/')
          && !['/404', '/404/', '/404.html'].includes(pathname)
        );
      },
    }),
  ],
  markdown: {
    processor: unified({ remarkPlugins: [remarkReferentielPpc] }),
  },
  vite: { plugins: [tailwindcss()] },
});
