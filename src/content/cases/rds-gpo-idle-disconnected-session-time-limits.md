---
title: "Set RDS idle and disconnected session limits with Group Policy"
slug: "rds-gpo-idle-disconnected-session-time-limits"
description: "Choose the correct Remote Desktop policy for idle sessions, disconnected sessions, or logoff, then verify scope and precedence before rollout."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "Remote Desktop Services"
vendor: "Microsoft"
versions: ["Windows Server 2016, 2019, 2022, and 2025; validate on the target RDS deployment"]
category: "Endpoint Management"
tags: ["Remote Desktop Services", "RDS", "Group Policy", "session timeout", "Windows Server"]
errorCodes: []
eventIds: []
logFiles: ["Group Policy Results", "Remote Desktop Services session state"]
symptoms: ["Disconnected RDS sessions remain on a session host.", "An idle-session policy disconnects users but does not log them off."]
visibility: published

sources:
  - label: "Microsoft: ADMX_TerminalServer policy settings"
    url: "https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-admx-terminalserver"
  - label: "Microsoft: Troubleshoot unexpected RDS session locks or disconnections"
    url: "https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/troubleshoot-unexpected-rds-session-locks-or-disconnections"
---

## Short answer

RDS has separate limits for an active but idle session and a disconnected session. The idle limit disconnects an active session when no input is received; the disconnected-session limit logs off a session that is already disconnected. If the requirement is to log off an active session after inactivity, configure the idle limit and the policy that ends sessions when time limits are reached.

## Choose the behavior first

- **Disconnect an active session after inactivity:** `Set time limit for active but idle Remote Desktop Services sessions`.
- **Log off an already disconnected session after a delay:** `Set time limit for disconnected sessions`.
- **Log off instead of merely disconnecting at an active-session limit:** configure `End session when time limits are reached` as well.

These policies do not mean “idle for eight hours and then disconnected for another eight hours.” Decide whether the timer applies to inactivity or to time spent disconnected, then set that specific limit. Applications with unsaved work can be interrupted by a logoff policy.

## Configure and scope the GPO

1. Create or edit a GPO linked only to the OU containing the intended Remote Desktop Session Host servers, or use user policy if the requirement is user-scoped.
2. In the Group Policy editor, navigate to:

   ```text
   Computer Configuration > Policies > Administrative Templates > Windows Components > Remote Desktop Services > Remote Desktop Session Host > Session Time Limits
   ```
3. Enable only the relevant policy and set the approved duration. If both user and computer policy define the same setting, the computer setting takes precedence.
4. If idle sessions must be ended rather than left disconnected, enable **End session when time limits are reached** for the intended scope.
5. Review other applied GPOs and collection/session settings for shorter or conflicting limits before rollout.
6. Apply the policy to a pilot host, refresh Group Policy, and reconnect test sessions. Existing sessions may need to reconnect or sign in again before policy behavior is reflected.

## Verify the result

Use Group Policy Results or `gpresult` to confirm the intended policy and winning GPO on a target session host. Test both an active idle session and a manually disconnected session, because the two timers act on different states. Confirm the resulting behavior in the RDS session list and with a test account before expanding the GPO scope.

## Scope and cautions

These settings apply to Remote Desktop Services sessions, not ordinary console use. Microsoft notes that an idle limit disconnects the session unless the end-session policy changes that behavior. Keep a recovery path and communicate the timeout to users before applying a logoff policy to production hosts.

## Sources

- [ADMX_TerminalServer policy settings](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-admx-terminalserver)
- [Troubleshoot unexpected RDS session locks or disconnections](https://learn.microsoft.com/en-us/troubleshoot/windows-server/remote/troubleshoot-unexpected-rds-session-locks-or-disconnections)
