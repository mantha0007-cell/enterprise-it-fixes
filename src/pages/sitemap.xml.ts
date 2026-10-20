import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { facets, slugify } from '../lib/cases';
import { categoryContent } from '../lib/category-content';

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '');
  const entries = origin ? await getCollection('cases', ({ data }) => data.visibility === 'published') : [];
  const categoryPages = facets(entries).categories
    .filter((name) => categoryContent[name] && entries.filter(({ data }) => data.category === name).length >= 3)
    .map((name) => ({ path: `/browse/categories/${slugify(name)}/` }));
  // Without the final deployment origin, emit an empty valid sitemap rather than incorrect local URLs.
  const pages = origin
    ? [
        ...['/', '/about/', '/privacy/', '/browse/'].map((path) => ({ path })),
        ...categoryPages,
        ...entries.map(({ data }) => ({
          path: `/cases/${data.slug}/`,
          lastmod: data.dateModified.toISOString().slice(0, 10),
        })),
      ]
    : [];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(({ path, lastmod }) => `<url><loc>${origin}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
