# Enterprise IT Fixes

An English-language library of real enterprise IT troubleshooting cases. The site puts the short answer first and records the evidence, root cause, fix, and verification for each case.

## Status

The initial site source is an Astro static site. Its only case is an explicitly marked demo with no technical diagnosis or fix. The demo is excluded from search indexing and the internal search index. No analytics or advertising code is included.

The site is published on [Cloudflare Pages](https://enterprise-it-fixes.pages.dev/). Cloudflare builds the `main` branch from the GitHub repository with the Astro preset, `pnpm build`, and `dist` as the output directory. The `SITE_URL` build variable is set to the production URL so canonical links and the sitemap use the public origin. The Cloudflare GitHub App is restricted to this repository.

## Add a case

1. Copy `src/content/cases/sample-case.md` and give it a unique filename and slug.
2. Fill every frontmatter field using the same spelling and types. Keep exact error codes, event IDs, log file names, product names, and version strings when they are safe to share.
3. Write the case in English using the headings in the template. Put the verified fix near the top.
4. Change `status` to `verified` and `verified` to `true` only after the root cause and fix were confirmed in the stated environment.
5. Remove the demo warning and demo wording. Check the privacy checklist before committing.
6. Update `dateModified` and `lastVerified` only when the case was actually reviewed or tested.

Unverified suggestions are not published as verified solutions. Do not invent technical facts to fill an empty section.

## Privacy review before publication

Review every case, attachment, code block, and screenshot. Remove or replace:

- company, customer, tenant, subscription, and internal domain names;
- usernames, e-mail addresses, hostnames, serial numbers, and device identifiers;
- internal or sensitive public IP addresses;
- passwords, access tokens, API keys, private keys, certificates, and other secrets;
- screenshots or log excerpts that expose confidential data;
- details that identify a customer or disclose an internal security posture.

Use consistent placeholders such as `example.com`, `SERVER-01`, or `<tenant-id>`. Re-read the final rendered page and search the source for `@`, tenant IDs, long hexadecimal strings, and real organization names. A Git commit is public and cannot be made private by removing the text in a later commit.

## Run locally

Requires Node.js 22.12 or newer and pnpm.

```powershell
cd work/enterprise-it-fixes
pnpm install
pnpm dev
```

Open the local URL printed by Astro. Local preview pages include `noindex` metadata.

## Build

```powershell
pnpm build
pnpm preview
```

For a production build, set `SITE_URL` to the exact public origin first. This sets canonical URLs and the sitemap. Search Console and Bing Webmaster verification values can later be added as verification meta tags in `src/layouts/SiteLayout.astro` after the hosting origin is known.

## Deploy

Cloudflare Pages deploys automatically when `main` changes. For another host, use `pnpm build`, publish `dist/`, and set `SITE_URL` to that host's final HTTPS origin.

## Search, SEO, and structured data

The browser-side search uses a generated JSON index and includes verified cases only. Case pages emit `TechArticle` and breadcrumb structured data; they do not claim a HowTo rich result. The sitemap includes site and case pages when `SITE_URL` is set. Demo pages and the search page use `noindex`.

## Project structure

- `src/content/cases/` — Markdown cases and required metadata.
- `src/pages/` — homepage, cases, search, browse facets, About, Privacy, and 404.
- `src/layouts/` — shared document shell, metadata, responsive styling.
- `public/` — static assets and the small client-side search script.
