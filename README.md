# Enterprise IT Fixes

An English-language library of practical enterprise IT troubleshooting guides. Search exact error codes, event IDs, log lines, products, and symptoms to find steps that may help with similar problems.

Articles explain issue patterns in original wording and link to relevant vendor sources. Each guide must add a diagnostic angle of its own, such as a decision path, a useful comparison, or a risk boundary; a plain paraphrase of a vendor article is not enough. The guides are intended as helpful guidelines: the actual cause and suitable change depend on the environment. They do not claim that Enterprise IT Fixes investigated a specific customer's incident or applied a fix in that environment.

This repository currently publishes twenty guides. The sample page is a non-indexed draft and is excluded from case routes, search, browsing, and the sitemap. Cloudflare Web Analytics is enabled for the Pages project. Google Analytics is not implemented or active; the site has no Google Analytics tag or analytics choice popup. Advertising and affiliate placements are inactive.

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
14. Outlook messages missing from Classic Outlook
15. Choosing between chat threads, Codex subagents, and programmable agent workflows
16. Setting up a Windows Hello PIN on Windows 11
17. Setting Chrome as the default browser and file handler in Windows 11
18. Troubleshooting PDF downloads instead of previews in a browser portal
19. Windows .NET Framework 3.5 error 0x800F0950
20. Windows .NET Framework 3.5 source download failure 0x800F0906

These topics target specific troubleshooting queries. Search demand and traffic are not guaranteed or measured here.

## Hosting

The site is published on [Cloudflare Pages](https://enterprise-it-fixes.pages.dev/). Cloudflare builds the main branch from the GitHub repository with the Astro preset, pnpm build, and dist as the output directory. SITE_URL is set to the production URL so canonical links and the sitemap use the public origin. The Cloudflare GitHub App is restricted to this repository.

## Analytics and advertising

Cloudflare Web Analytics is enabled in the Pages project. Google Analytics is not implemented: there is no GA4 measurement ID, Google tag, or analytics consent popup in the site. Do not add a measurement ID alone; a future GA integration would also need a reviewed consent and withdrawal flow before it is enabled.

Advertising remains off. An optional responsive AdSense component exists at the end of published guides, but it emits no ad markup or script unless `ADSENSE_ENABLED=true`, `ADSENSE_CMP_READY=true`, and valid `ADSENSE_PUBLISHER_ID` and `ADSENSE_GUIDE_SLOT` values are configured in the production build environment. The example configuration keeps both switches false and the account values blank. Do not activate it until the site has an approved AdSense account and a suitable consent setup; meaningful earnings are not guaranteed.

Affiliate or sponsor recommendations are optional per guide through the `commercialRecommendation` frontmatter object. Add one only for a relevant provider after an actual partner relationship/link is available. Keep descriptions original and useful, do not claim testing or endorsement that did not happen, and retain the visible relationship disclosure rendered by `PartnerRecommendation.astro`. Do not add commercial links to every guide just to monetize them; update the Privacy page before activating a partner or advertising integration.

## Add or update a guide

1. Start from src/content/cases/sample-case.md and use a unique filename and slug.
2. Fill every required frontmatter field. Keep exact error codes, event IDs, log file names, products, and versions only where they are safe and useful to share.
3. Write in English with concise, original wording. Link primary vendor sources for technical behavior and retain only short error text needed to identify the problem.
4. Present the issue as a troubleshooting pattern. Separate likely causes from confirmed facts; do not invent a customer, incident, root cause, command result, or successful fix.
5. Explain what varies by version or environment. Phrase recommendations as steps to investigate or try when the source and context support them.
6. Update dateModified when content changes.
7. Run `pnpm check:originality`, resolve all reported overlaps, and manually compare every article with its sources.
8. Complete PUBLISH-CHECKLIST.md and inspect the rendered page before publication.

Do not copy vendor article text, screenshots, or diagrams. Use source material to verify facts, then write the article's explanation and diagnostic model independently. Keep only short error identifiers, standard product names, commands, and exact log fragments needed to identify the issue; link to the original source instead of reproducing its explanatory prose. Compare the final article with every cited source and rewrite any unnecessary long matching phrase. If uncertain whether a passage is too close, remove it or replace it with a link. A phrase scan is only a screening aid, not a legal safe harbor; this editorial standard reduces risk but cannot guarantee legal clearance.

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
