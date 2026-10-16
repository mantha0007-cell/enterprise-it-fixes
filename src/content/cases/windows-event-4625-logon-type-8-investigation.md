---
title: "Investigate repeated Windows Event 4625 logon failures"
slug: "windows-event-4625-logon-type-8-investigation"
description: "Use Event 4625 fields and process evidence to trace repeated failed logons without assuming a blank source address means the attempt was local."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "Windows Security Auditing"
vendor: "Microsoft"
versions: ["Windows Server 2016 and later; event fields vary by event version"]
category: "Identity and access"
tags: ["Windows Server", "Event 4625", "failed logon", "Logon Type 8", "Security log"]
errorCodes: []
eventIds: ["4625", "4688"]
logFiles: ["Windows Security log"]
symptoms: ["Repeated Event 4625 entries reference the same account.", "The source address is blank or unavailable and the origin is unclear."]
visibility: published

sources:
  - label: "Microsoft: Event 4625 — an account failed to log on"
    url: "https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4625"
  - label: "Microsoft: Event 4688 — a new process has been created"
    url: "https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4688"
---

## Short answer

Event 4625 is recorded on the computer where a logon attempt was made. Logon Type 8 is `NetworkCleartext`: it describes the authentication path, not proof that a password crossed the network unprotected. A blank client address or a workstation name matching the server does not establish that a local process caused the attempt.

## Our diagnostic lens

Use the event as a set of independent clues: **target account → logon type → status/substatus → source fields → process fields**. Avoid drawing a location conclusion from one field. If the event includes a caller process name and process ID, use them as leads and correlate by time; process IDs can be reused.

## Investigation

1. **Group failures by time and target account.** Record event time, computer where it was logged, target account, logon type, status, and substatus. Redact names and domains before sharing event data.
2. **Read the event's XML or General details.** Check `TargetUserName`, `LogonType`, `Status`, `SubStatus`, `WorkstationName`, `IpAddress`, `ProcessName`, and `ProcessId`. Field availability can vary by Windows event version and audit path.
3. **Interpret Logon Type 8 carefully.** It is a network logon using the `NetworkCleartext` authentication path. Windows transforms the credential before transmission; the event label alone does not show the transport protection or identify the application.
4. **Treat missing source details as unknown.** A dash or blank `IpAddress` is not equivalent to localhost. Use the event computer, workstation field, authentication package, and adjacent events to narrow the path.
5. **Correlate process evidence when present.** If `ProcessName` and `ProcessId` identify a caller, compare the timestamp and PID with process-creation auditing (Event 4688) or approved endpoint telemetry. A PID match without close timestamp correlation is weak evidence because Windows reuses PIDs.
6. **Check likely credential consumers.** After the originating host or process is evidenced, review only relevant services, scheduled tasks, application pools, saved credentials, scripts, or application configuration for stale credentials. Do not remove profiles or registry entries just because an account name appears there.

## Likely investigation branches

- **A process path and matching process-creation event are available:** identify the service or application owner and update its stored credentials through its supported configuration.
- **A remote workstation or address is present:** investigate the client and the service it is contacting; preserve the timestamp and destination server.
- **Source fields are absent and process data is unavailable:** enable or use approved audit/endpoint telemetry for a short, controlled capture. The current event may not contain enough evidence to name the source.

## How to check the result

After correcting a confirmed credential source, monitor the same server and account for new Event 4625 entries. Verify the failures stop over an interval that covers the previous recurrence pattern. A quiet interval alone does not prove which change fixed the issue unless the event source was independently identified.

## Sources

- [Event 4625 — an account failed to log on](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4625)
- [Event 4688 — a new process has been created](https://learn.microsoft.com/en-us/previous-versions/windows/it-pro/windows-10/security/threat-protection/auditing/event-4688)
