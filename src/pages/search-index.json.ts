import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const entries = await getCollection('cases', ({data}) => data.status === 'verified' && data.verified);
  const index = entries.map(({ data }) => ({
    title: data.title,
    description: data.description,
    url: `/cases/${data.slug}/`,
    product: data.product,
    vendor: data.vendor,
    versions: data.versions,
    category: data.category,
    tags: data.tags,
    errorCodes: data.errorCodes,
    eventIds: data.eventIds,
    logFiles: data.logFiles,
    symptoms: data.symptoms,
    dateModified: data.dateModified.toISOString().slice(0,10),
  }));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
