import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const origin = site?.toString().replace(/\/$/, '');
  // Without the final deployment origin, emit an empty valid sitemap rather than incorrect local URLs.
  const paths = origin ? ['/', '/about/', '/privacy/', '/browse/', ...(await getCollection('cases', ({data}) => data.visibility === 'published')).map(({data}) => `/cases/${data.slug}/`)] : [];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join('')}</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
