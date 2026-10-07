# Publication and privacy checklist

Complete this review before publishing a page to the public repository.

## Evidence and technical accuracy

- [ ] The evidence label matches the page: documented guide or field-verified fix.
- [ ] A documented guide links primary vendor material, uses original wording, and does not claim an incident was investigated or tested here.
- [ ] A field-verified fix describes a real issue investigated in the stated environment.
- [ ] Exact symptoms, error codes, event IDs, versions, and environment are supported by evidence or cited vendor documentation.
- [ ] A field-verified fix has evidence for its root cause, the applied change, and a successful retest.
- [ ] Commands and configuration snippets were reviewed for accuracy and operational safety.
- [ ] Vendor sources support the linked claims and are relevant to the stated product/version.
- [ ] The short answer explains scope and does not overstate applicability.
- [ ] Version and review dates are accurate; lastVerified is set only after a real retest.

## Privacy and security

- [ ] Company, customer, tenant, and internal domain names were removed or replaced.
- [ ] Usernames, e-mail addresses, hostnames, tenant IDs, subscription IDs, serial numbers, and device identifiers were removed.
- [ ] IP addresses were checked and replaced where disclosure is not appropriate.
- [ ] No passwords, tokens, API keys, private keys, or confidential certificate information remain.
- [ ] Screenshots and logs were reviewed for hidden or cropped identifiers.
- [ ] No customer or employer confidential information is disclosed.
- [ ] Search the finished text for e-mail patterns, internal DNS suffixes, tenant GUIDs, and long secret-like strings.
- [ ] The rendered page was reviewed as well as the Markdown source.

## Publication

- [ ] Frontmatter is complete and the dates reflect publication or review accurately.
- [ ] Demo or draft warnings appear only on intentionally private/non-indexed content.
- [ ] Links work and the page is readable on a narrow screen.
- [ ] The public diff was reviewed before commit or push.
