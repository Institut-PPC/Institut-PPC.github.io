import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error('La propriété site doit être définie dans astro.config.mjs.');
  }

  const sitemapUrl = new URL('/sitemap-index.xml', site);
  const contenu = `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(contenu, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
