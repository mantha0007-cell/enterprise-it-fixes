import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export const GET: APIRoute = async ({ site }) => {
  const origin = (site ?? new URL('https://enterprise-it-fixes.pages.dev')).toString().replace(/\/$/, '');
  const entries = (await getCollection('cases', ({ data }) => data.visibility === 'published'))
    .sort((a, b) => b.data.dateModified.valueOf() - a.data.dateModified.valueOf())
    .slice(0, 50);
  const updated = entries[0]?.data.dateModified.toUTCString() ?? new Date().toUTCString();
  const items = entries.map(({ data }) => {
    const url = `${origin}/cases/${data.slug}/`;
    return `<item><title>${escapeXml(data.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escapeXml(data.description)}</description><pubDate>${data.dateModified.toUTCString()}</pubDate></item>`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Enterprise IT Fixes — guide updates</title><link>${origin}/</link><description>New and substantially updated enterprise IT troubleshooting guides, with linked vendor references.</description><language>en</language><lastBuildDate>${updated}</lastBuildDate><atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
