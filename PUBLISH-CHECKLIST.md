# Publication and privacy checklist

Complete this review before publishing a page to the public repository.

## Technical accuracy and sources

- [ ] Exact symptoms, error codes, event IDs, versions, and environment details are supported by cited sources.
- [ ] The article distinguishes source-supported behavior from likely causes that still need checking in a reader's environment.
- [ ] The page presents general troubleshooting guidance and does not imply that this site investigated a specific customer incident or applied a fix there.
- [ ] Vendor sources directly support the linked claims and apply to the stated product/version.
- [ ] Commands and configuration snippets were checked for accuracy and operational safety.
- [ ] Suggested changes are scoped, explain relevant risks, and direct readers to vendor documentation where appropriate.
- [ ] The short answer explains the symptom and scope without promising a universal fix.
- [ ] The article uses original wording. Only short exact error text needed to identify a problem is reproduced; vendor text, screenshots, and diagrams are not copied.
- [ ] The guide contributes a specific diagnostic interpretation or decision path of its own, rather than only summarizing source material.
- [ ] The prose was compared with every cited source. Rewrite unnecessary long exact matches; a phrase scan is an editorial aid, not proof of legal clearance.
- [ ] `pnpm check:originality` completes with all source pages available and no unresolved phrase matches.
- [ ] When a passage feels too close to the source or its originality is uncertain, remove it and link the reader to the source instead.
- [ ] Publication and update dates are accurate.

## Privacy and security

- [ ] Company, customer, tenant, and internal domain names were removed or replaced.
- [ ] Usernames, e-mail addresses, hostnames, tenant GUIDs, subscription IDs, serial numbers, and device identifiers were removed.
- [ ] IP addresses were checked and replaced where disclosure is not appropriate.
- [ ] No passwords, tokens, API keys, private keys, or confidential certificate information remain.
- [ ] Screenshots and logs were reviewed for hidden or cropped identifiers.
- [ ] No customer or employer confidential information is disclosed.
- [ ] Search the finished text for e-mail patterns, internal DNS suffixes, tenant GUIDs, and long secret-like strings.
- [ ] The rendered page was reviewed as well as the Markdown source.

## Publication

- [ ] Frontmatter is complete and dates reflect publication or content updates accurately.
- [ ] Demo or draft content is excluded from public routes, search, browsing, and the sitemap.
- [ ] Links work and the page is readable on a narrow screen.
- [ ] The public diff was reviewed before commit or push.
