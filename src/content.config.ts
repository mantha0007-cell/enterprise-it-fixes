import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    description: z.string().max(180),
    datePublished: z.coerce.date(),
    dateModified: z.coerce.date(),
    product: z.string(),
    vendor: z.string(),
    versions: z.array(z.string()),
    category: z.string(),
    tags: z.array(z.string()),
    errorCodes: z.array(z.string()),
    eventIds: z.array(z.string()),
    logFiles: z.array(z.string()),
    symptoms: z.array(z.string()),
    visibility: z.enum(['published', 'demo', 'draft']),
    sources: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  }),
});

export const collections = { cases };
