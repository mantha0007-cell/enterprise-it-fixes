---
title: "DNS Event 4013: AD replication waits"
slug: "windows-server-dns-event-4013-ad-replication"
description: "Diagnose DNS Server Event ID 4013 by checking AD DS initial synchronization, replication, DC discovery, and DNS startup dependencies."
datePublished: 2026-10-07
dateModified: 2026-10-10
product: "Windows Server DNS Server"
vendor: "Microsoft"
versions: ["Windows Server; verify the current article applies to your version"]
category: "Directory Services"
tags: ["windows-server", "dns", "active-directory", "replication"]
errorCodes: []
eventIds: ["4013"]
logFiles: ["DNS Server event log", "Directory Service event log", "System event log"]
symptoms: ["A domain controller records DNS Event 4013 during startup.", "AD-backed DNS answers remain unavailable or return only after a long startup delay."]
visibility: published

sources:
  - label: "Microsoft: Troubleshoot DNS Event ID 4013"
    url: "https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/troubleshoot-dns-event-id-4013"
---
## Short answer

DNS Server Event ID 4013 indicates that DNS startup is waiting for Active Directory Domain Services initial synchronization so AD-integrated zone data can be available. A brief event during domain-controller startup can be transient. If it persists or clients lose name resolution, investigate AD replication, DC discovery, and DNS dependencies before changing synchronization behavior.

## Our diagnostic lens

Read this event on a timeline. **One startup warning that clears** points to a different investigation from **repeated 4013 events with DNS still unavailable**. For a persistent delay, compare replication and name resolution from the affected controller to its partners; the event is the wait condition, not a diagnosis of which dependency failed. Keep at least one healthy DNS/domain-controller path available while investigating, and avoid changing initial-sync behavior to hide the wait.

## Symptoms

- DNS Server logs Event ID `4013`.
- AD-integrated zones are not immediately available after startup.
- Domain controllers or clients report DNS lookup failures while a DC is waiting for directory synchronization.

## Exact event and evidence

Capture the full Event 4013 message and timestamp, plus relevant Directory Service and System events. The event alone does not identify the underlying replication or name-resolution fault.

## Environment

Windows Server domain controllers hosting DNS with AD-integrated zones. Startup sequencing and behavior can vary by Windows Server version and domain topology.

## Evidence to collect

1. Determine whether the event clears after startup or repeats while DNS service remains unavailable.
2. Check domain-controller discovery and replication health using supported read-only diagnostics such as `dcdiag` and `repadmin`.
3. Verify the DC can resolve required records for its replication partners and domain services, including the configured DNS client settings.
4. Review AD replication errors, unreachable partners, stale DC references, and network or firewall interruptions.
5. Correlate the event with reboot order and whether multiple DCs or DNS servers were unavailable at the same time.

Example read-only checks:

```cmd
dcdiag /test:dns /v
repadmin /replsummary
repadmin /showrepl
```

Review output locally and redact domain names, server names, and IP addresses before sharing.

## Likely causes
DNS is waiting for AD DS initial synchronization, or the DC cannot complete the expected synchronization because a replication partner or required DNS record is unavailable. Event 4013 is a startup symptom; use the surrounding directory and DNS evidence to identify the cause.

## Suggested troubleshooting steps
Restore reliable DNS resolution and AD replication between healthy domain controllers. Correct DNS client configuration, replication connectivity, stale references, or startup sequencing only where the collected evidence supports it. Avoid rebooting all DCs together; preserve a reachable, healthy DNS/DC path during recovery.

Do not set `Repl Perform Initial Synchronizations` to `0` as a standing production fix. Microsoft warns this can cause lingering objects and is not recommended for production environments. Use only a vendor-supported, temporary recovery procedure when directed by Microsoft support and with a rollback plan.

## How to check the result
Confirm AD replication converges, the DC advertises and resolves required domain records, AD-integrated zones load, and DNS clients resolve representative records. Monitor after a controlled restart if startup behavior was part of the incident.

## Version notes

Check the linked Microsoft article against the specific Windows Server versions and topology. DNS, AD DS, and replication behavior depend on supported-version details.

## Sources

- [Microsoft: Troubleshoot DNS Event ID 4013](https://learn.microsoft.com/en-us/troubleshoot/windows-server/networking/troubleshoot-dns-event-id-4013)
