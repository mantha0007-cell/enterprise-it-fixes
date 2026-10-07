# Publication and privacy checklist

Complete this review before every case is committed to the public repository.

## Technical evidence

- [ ] This is a real issue that was investigated, not generic generated content.
- [ ] Exact symptoms, errors, versions, and environment are accurate.
- [ ] The root cause is supported by the recorded evidence.
- [ ] The proposed solution was applied and the issue was retested.
- [ ] Commands and configuration snippets were reviewed for safety and accuracy.
- [ ] Vendor documentation is linked for claims that need an authoritative reference.
- [ ] The case status and `verified` flag match the evidence.
- [ ] The short answer describes the result without overstating applicability.

## Privacy and security

- [ ] Company, customer, tenant, and internal domain names were removed or replaced.
- [ ] Usernames, e-mail addresses, hostnames, tenant IDs, subscription IDs, serial numbers, and device identifiers were removed.
- [ ] IP addresses were checked and replaced where disclosure is not appropriate.
- [ ] No passwords, tokens, API keys, private keys, or confidential certificate information remain.
- [ ] Screenshots and logs were reviewed at full resolution for hidden or cropped identifiers.
- [ ] No customer or employer confidential information is disclosed.
- [ ] Search the finished text for e-mail patterns, internal DNS suffixes, tenant GUIDs, and long secret-like strings.
- [ ] The rendered page was reviewed as well as the Markdown source.

## Publication

- [ ] Frontmatter fields are complete and dates reflect actual publication or verification.
- [ ] The final file contains no sample/demo warning unless it is intentionally a demo.
- [ ] Links work and the case is readable on a narrow screen.
- [ ] The public diff was reviewed before commit or push.
