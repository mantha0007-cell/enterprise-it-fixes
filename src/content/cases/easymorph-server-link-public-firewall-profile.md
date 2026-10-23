---
title: "EasyMorph Server Link times out after a reboot: check the Windows firewall profile"
slug: "easymorph-server-link-public-firewall-profile"
description: "A solved connection case where EasyMorph Server stayed running, but Windows applied the Public firewall profile after domain detection failed."
datePublished: 2026-10-23
dateModified: 2026-10-23
product: "EasyMorph Server and Windows networking"
vendor: "EasyMorph and Microsoft"
versions: ["EasyMorph Server using its configured Server Link port; Windows domain network profile"]
category: "Networking"
tags: ["easymorph", "windows-firewall", "network-profile", "domain-controller", "server-link", "troubleshooting"]
errorCodes: []
eventIds: []
logFiles: ["Windows NetworkProfile Operational log", "Windows Firewall log", "EasyMorph Server logs"]
symptoms: ["EasyMorph Desktop reports a Server Link timeout", "The server is reachable by remote desktop and the EasyMorph service is running", "The connection fails on port 6330 after Windows updates or restarts"]
visibility: published
sources:
  - label: "Microsoft: Domain-joined machines can't detect the domain profile"
    url: "https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/domain-joined-machines-cannot-detect-domain-profile"
  - label: "Microsoft: Windows Firewall overview and profiles"
    url: "https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/"
  - label: "Microsoft: Get-NetConnectionProfile"
    url: "https://learn.microsoft.com/en-us/powershell/module/netconnection/get-netconnectionprofile"
  - label: "EasyMorph: Server Link and default port"
    url: "https://easymorph.com/documents/Architecture%20and%20Security%20Overview.pdf"
---

## Case result

In this anonymized incident, EasyMorph Server remained running and administrators could reach the host remotely, but EasyMorph Desktop timed out when connecting to Server Link on TCP port 6330. The failure happened after Windows updates and two restarts. The active Windows network profile had become **Public**, while the server's existing EasyMorph firewall rule covered the **Domain** and **Private** profiles.

After the Network Location Awareness service was restarted during troubleshooting, Windows identified the domain network again and the Domain firewall profile became active. The Server Link connection then worked. The immediate recovery was observed; the incident record did not include a later user confirmation of long-term stability.

## Why a running service can still time out

Remote desktop access proves that one management path to the host works. It does not prove that the EasyMorph Server listener is reachable from the Desktop client. Likewise, a running service does not prove that Windows Firewall permits the inbound application port under the currently active profile.

EasyMorph documents TCP port **6330** as the default Server Link port; administrators can configure a different port. Windows applies firewall rules according to the active network profile. The Domain profile is detected when the computer can identify and authenticate to a domain controller. If that detection fails, a domain-specific allow rule may not apply even though the server and application are otherwise healthy.

## Check the path in order

1. On the EasyMorph Server host, confirm the configured listening port and that the service is running. Do not assume 6330 if the installation uses a custom port.
2. On the server, run `Get-NetConnectionProfile` and record the profile for the relevant network adapter. A domain-connected server is expected to show `DomainAuthenticated` when it can authenticate to a domain controller.
3. From the affected Desktop client, test the server's configured port:

   ```powershell
   Test-NetConnection -ComputerName <server-name> -Port 6330
   ```

   A failed TCP test points to name resolution, routing, or filtering before it points to EasyMorph credentials or workspace permissions.
4. On the server, inspect the inbound EasyMorph firewall rule and its enabled profiles. Check whether the current profile is included; do not disable Windows Firewall or broadly enable the rule for Public networks as a shortcut.
5. If the profile is Public on a domain network, verify domain-controller discovery, DNS resolution, and required connectivity to a domain controller. Microsoft documents `nltest /dsgetdc:<domain>` and the NetworkProfile Operational log as useful checks.
6. Only after the Windows profile and TCP path are correct, test Server Link authentication and the EasyMorph space permissions.

## What resolved this incident

The case investigation found that the server application had not stopped. Windows had selected a profile that did not match the existing firewall rule. Restarting Network Location Awareness caused domain detection to run again; the host returned to the Domain profile and the connection recovered.

Treat that as the observed recovery in this case, not a universal fix. On current Windows versions, the component responsible for profile detection can differ. Diagnose the active profile and the domain-controller path first, then follow the supported recovery procedure for the affected Windows version. If profile detection keeps failing, preserve the relevant event logs and investigate DNS, routes, adapter timing, and domain-controller reachability rather than opening the application to every network.

## How to confirm recovery

- `Get-NetConnectionProfile` shows the expected network category on the server.
- `Test-NetConnection` from the client succeeds on the configured EasyMorph port.
- EasyMorph Desktop can establish Server Link and open the intended Server space.
- The result remains stable after a normal reconnect or restart; a single successful retry confirms immediate recovery, not long-term stability.

## Sources

- [Domain-joined machines can't detect the domain profile](https://learn.microsoft.com/en-us/troubleshoot/windows-client/networking/domain-joined-machines-cannot-detect-domain-profile)
- [Windows Firewall overview and profiles](https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/)
- [Get-NetConnectionProfile](https://learn.microsoft.com/en-us/powershell/module/netconnection/get-netconnectionprofile)
- [EasyMorph architecture and data-flow overview](https://easymorph.com/documents/Architecture%20and%20Security%20Overview.pdf)

This is an anonymized account of one observed recovery. It does not establish that every EasyMorph timeout is caused by Windows Firewall or domain detection; verify the profile, listener, route, and configured port in the affected environment.
