---
title: "DHCP Event 20322: DNS error 9009 during PTR registration"
slug: "dhcp-event-20322-dns-9009-ptr-registration"
description: "Trace a DHCP PTR update rejected with DNS error 9009 by checking the reverse zone authority, update target, and event evidence before changing permissions."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "Windows Server DHCP and DNS"
vendor: "Microsoft"
versions: ["Windows Server DHCP and DNS; verify behavior on the installed release"]
category: "Directory Services"
tags: ["DHCP", "DNS", "PTR record", "dynamic DNS", "Event 20322"]
errorCodes: ["9009", "DNS_ERROR_RCODE_NOTAUTH"]
eventIds: ["20322"]
logFiles: ["DHCP Server event log", "DNS Server Audit log"]
symptoms: ["A DHCP event reports that PTR registration failed with error 9009.", "The reverse lookup zone appears to exist, but the registration still fails."]
visibility: published

sources:
  - label: "Microsoft: System error codes 9000–11999"
    url: "https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes--9000-11999-"
  - label: "Microsoft: Dynamic DNS update in Windows and Windows Server"
    url: "https://learn.microsoft.com/en-us/windows-server/networking/dns/dynamic-update"
  - label: "Microsoft: Troubleshooting DNS dynamic update issues"
    url: "https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/troubleshooting-dns-dynamic-update-issues"
  - label: "Microsoft: Enable DNS logging and diagnostics in Windows Server"
    url: "https://learn.microsoft.com/en-us/windows-server/networking/dns/dns-logging-and-diagnostics"
---

## Short answer

Error 9009 is the DNS response `NOTAUTH`: the server that received the update says it is not authoritative for the zone. That points first to the target server and reverse-zone authority. It does not, by itself, prove that the DHCP server lacks permission to write the record.

## Diagnostic approach

Follow the update path in order: identify the exact PTR name from the event, identify which DNS server received the request, then establish whether that server is authoritative for the corresponding reverse zone. Only investigate secure-update ownership or credentials after the request reaches the correct authoritative zone. A zone visible on one DNS server can still be absent, differently delegated, or not writable on the server DHCP actually contacted.

This is a troubleshooting guide, not a claim that a particular customer incident was resolved.

## What to check

1. **Read the complete DHCP event.** Record its timestamp, IPv4 address, FQDN, error number, and DHCP server. Remove client names and addresses before sharing logs.
2. **Derive the reverse name.** Use the leased address and subnet design to determine the expected reverse lookup zone. Classless delegations can differ from a simple `/24` reverse zone.
3. **Check the DNS server that received the update.** Review the DHCP server's configured DNS targets and the DNS Server audit events at the same time. Event 519 can record a dynamic record creation and the source address. Audit logs are local to the DNS server that handled the update.
4. **Verify authority and delegation.** On the target DNS server, confirm the reverse zone is loaded and authoritative for the name. Compare the result with the intended primary or AD-integrated DNS servers; do not infer authority just because a zone exists elsewhere.
5. **Separate authority from authorization.** `NOTAUTH` is a zone-authority response. If the authoritative server is reached but refuses a secure update, then review the zone's secure dynamic-update configuration, record ownership, and the DHCP DNS-update identity using Microsoft's guidance.
6. **Retest one client update.** Use a controlled lease renewal or the approved DHCP/DNS test procedure, then confirm the matching audit event and PTR answer.

## Avoid broad permission changes

Do not add DHCP computers to `DnsUpdateProxy`, grant broad write access, or change a zone to nonsecure updates just because error 9009 appears. Those actions change the security model and do not correct a request sent to a non-authoritative server. If evidence later points to secure-update ownership, use a dedicated least-privilege design reviewed for the domain-controller and DHCP placement.

## How to interpret the result

- **The target DNS server is not authoritative:** correct the DHCP DNS target or the reverse-zone delegation/replication path through the responsible DNS administrator.
- **Authority is confirmed but the update is refused:** investigate secure dynamic-update policy and the record owner; treat that as a separate failure from `NOTAUTH`.
- **No matching DNS audit entry is found:** check the other authoritative servers and log retention before concluding that no update was attempted.

## Sources

- [System error codes 9000–11999](https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes--9000-11999-)
- [Dynamic DNS update in Windows and Windows Server](https://learn.microsoft.com/en-us/windows-server/networking/dns/dynamic-update)
- [Troubleshooting DNS dynamic update issues](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/troubleshooting-dns-dynamic-update-issues)
- [Enable DNS logging and diagnostics in Windows Server](https://learn.microsoft.com/en-us/windows-server/networking/dns/dns-logging-and-diagnostics)
