# Enterprise IT Fixes

An English-language library of practical enterprise IT troubleshooting guides. Search exact error codes, event IDs, log lines, products, and symptoms to find steps that may help with similar problems.

Articles explain issue patterns in original wording and link to relevant vendor sources. They are intended as helpful guidelines: the actual cause and suitable change depend on the environment. They do not claim that Enterprise IT Fixes investigated a specific customer's incident or applied a fix in that environment.

This repository currently publishes thirteen guides. The sample page is a non-indexed draft and is excluded from case routes, search, browsing, and the sitemap. Cloudflare Web Analytics is enabled for the Pages project. Google Analytics is prepared but remains inactive until a GA4 Measurement ID is configured; its tag is gated behind an explicit analytics choice. No advertising code or slots are active.

## Published guides

1. Microsoft Entra AADSTS50011 redirect URI mismatch
2. Microsoft Entra AADSTS700016 application not found
3. Microsoft Entra AADSTS50076 MFA required
4. Microsoft Entra AADSTS50020 account or tenant mismatch
5. Microsoft Entra AADSTS50105 app assignment required
6. Microsoft Entra AADSTS53003 Conditional Access block
7. Windows Update 0x800F081F source files not found
8. Windows Update 0x80070005 access denied
9. Exchange Online 550 5.7.520 external forwarding blocked
10. Intune UWP 0x87D1041C and System context
11. Configuration Manager PXE across routed subnets
12. Configuration Manager PXE certificate error 0x80092002
13. Windows DNS Server Event ID 4013

These topics target specific troubleshooting queries. Search demand and traffic are not guaranteed or measured here.

## Hosting

The site is published on [Cloudflare Pages](https://enterprise-it-fixes.pages.dev/). Cloudflare builds the main branch from the GitHub repository with the Astro preset, pnpm build, and dist as the output directory. SITE_URL is set to the production URL so canonical links and the sitemap use the public origin. The Cloudflare GitHub App is restricted to this repository.

## Analytics and advertising

Cloudflare Web Analytics is enabled in the Pages project and is injected by Cloudflare on the next deployment. Google Analytics is prepared as an optional feature. To activate it, set `PUBLIC_GA_MEASUREMENT_ID` to the GA4 web stream ID (`G-...`) in the Cloudflare Pages production build environment. The site then shows an accept/reject choice and loads the Google tag only after the visitor opts in. Without a valid ID, no consent prompt or Google request is emitted. Test the choice and withdrawal flow before activation.

Advertising remains off. Apply for AdSense only when the site has enough distinctive, useful content for review. Google must approve the site before ads can be served; personalized ads to EEA, UK, or Swiss visitors require a Google-certified CMP integrated with IAB TCF. Do not add ad code until account approval, the consent setup, and ad placement review are complete. If approved, use at most a small number of clearly separated placements that do not interrupt troubleshooting steps.

## Add or update a guide

1. Start from src/content/cases/sample-case.md and use a unique filename and slug.
2. Fill every required frontmatter field. Keep exact error codes, event IDs, log file names, products, and versions only where they are safe and useful to share.
3. Write in English with concise, original wording. Link primary vendor sources for technical behavior and retain only short error text needed to identify the problem.
4. Present the issue as a troubleshooting pattern. Separate likely causes from confirmed facts; do not invent a customer, incident, root cause, command result, or successful fix.
5. Explain what varies by version or environment. Phrase recommendations as steps to investigate or try when the source and context support them.
6. Update dateModified when content changes.
7. Complete PUBLISH-CHECKLIST.md and inspect the rendered page before publication.

Do not copy vendor article text, screenshots, or diagrams. Write an independent explanation, link the source, and review the public page for accidental quotation or unsupported claims. This editorial approach reduces copying risk but is not a legal guarantee.

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

The browser-side search uses a generated JSON index. Guide pages emit TechArticle and breadcrumb structured data. The sitemap contains published guides and site pages; drafts, demos, and the search page are excluded or marked noindex.

## Project structure

- src/content/cases/ — Markdown troubleshooting guides.
- src/pages/ — homepage, guides, search, browse facets, About, Privacy, and 404.
- src/layouts/ — shared document shell, metadata, and responsive styling.
- public/ — static assets and client-side search.
