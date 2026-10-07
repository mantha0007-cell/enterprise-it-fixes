# Enterprise IT Fixes

An English-language library for enterprise IT troubleshooting. Search exact error codes, event IDs, log lines, products, and symptoms. Every page states whether it is a vendor-documented guide or a fix verified in a real environment.

## Evidence labels

- **Documented guide — not field-tested:** original troubleshooting guidance based on linked vendor documentation. It is not presented as an incident investigated or reproduced by this site.
- **Field-verified fix:** a real issue with recorded evidence, an identified root cause, a fix applied, and a successful retest in the stated environment.

This repository currently publishes ten documented guides. The sample page is a non-indexed draft and is excluded from case routes, search, browsing, and the sitemap. No analytics or advertising code is included.

## Published guides

1. Microsoft Entra AADSTS50011 redirect URI mismatch
2. Microsoft Entra AADSTS700016 application not found
3. Microsoft Entra AADSTS50076 MFA required
4. Windows Update 0x800F081F source files not found
5. Windows Update 0x80070005 access denied
6. Exchange Online 550 5.7.520 external forwarding blocked
7. Intune UWP 0x87D1041C and System context
8. Configuration Manager PXE across routed subnets
9. Configuration Manager PXE certificate error 0x80092002
10. Windows DNS Server Event ID 4013

These topics target specific troubleshooting queries. Search demand and traffic are not guaranteed or measured here.

## Hosting

The site is published on [Cloudflare Pages](https://enterprise-it-fixes.pages.dev/). Cloudflare builds the main branch from the GitHub repository with the Astro preset, pnpm build, and dist as the output directory. SITE_URL is set to the production URL so canonical links and the sitemap use the public origin. The Cloudflare GitHub App is restricted to this repository.

## Add or update a guide

1. Start from src/content/cases/sample-case.md and use a unique filename and slug.
2. Fill every required frontmatter field. Keep exact error codes, event IDs, log file names, products, and versions only where they are safe to share.
3. Write in English using the headings in the template. Link primary vendor sources for documented behavior.
4. Use status documented and verified false for source-based guidance. Explain what remains environment-specific.
5. Use status verified and verified true only after a real issue was investigated, the root cause was supported by evidence, a fix was applied, and the result was retested in the stated environment.
6. Update dateModified when content changes. Set lastVerified only when the fix was actually tested again; set lastReviewed for a documentation review.
7. Complete PUBLISH-CHECKLIST.md and inspect the rendered page before publication.

Never invent incident details, logs, test results, or technical conclusions to fill a section.

## Privacy review

Review every case, attachment, code block, and screenshot. Remove company, customer, tenant, subscription, internal domain, user, e-mail, host, serial, and device identifiers. Check IP addresses and remove secrets, tokens, keys, and confidential certificates. Use placeholders such as example.com, SERVER-01, or <tenant-id>. Search the final content and review the rendered page before committing. A public Git commit cannot be made private by removing information in a later commit.

## Run locally

Requires Node.js 22.12 or newer and pnpm.

```powershell
pnpm install
pnpm dev
```

Open the local URL printed by Astro. Local preview pages include noindex metadata.

## Build

```powershell
pnpm build
pnpm preview
```

Set SITE_URL to the production origin for a production build. This controls canonical links and the sitemap.

## Deploy

Cloudflare Pages deploys automatically when main changes. For another static host, build with pnpm build, publish dist/, and set SITE_URL to the final HTTPS origin.

## Search and structured data

The browser-side search uses a generated JSON index. Case pages emit TechArticle and breadcrumb structured data. The sitemap contains published guides and site pages; drafts, demos, and the search page are excluded or marked noindex.

## Project structure

- src/content/cases/ — Markdown guides and fixes.
- src/pages/ — homepage, cases, search, browse facets, About, Privacy, and 404.
- src/layouts/ — shared document shell, metadata, and responsive styling.
- public/ — static assets and client-side search.
