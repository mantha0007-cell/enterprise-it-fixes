---
title: '0x800F0906: .NET 3.5 download failure'
slug: dotnet-35-0x800f0906-download-failure
description: 'Diagnose .NET Framework 3.5 error 0x800F0906 by tracing the configured payload source, Windows build, network path, and management policy.'
datePublished: 2026-10-10
dateModified: 2026-10-10
product: '.NET Framework 3.5'
vendor: 'Microsoft'
versions: ['Windows client and Windows Server releases that support .NET Framework 3.5; installation method varies by release']
category: 'Windows servicing'
tags: ['.NET Framework 3.5', 'NetFx3', 'Windows Update', 'WSUS', 'Windows servicing', 'DISM']
errorCodes: ['0x800F0906', 'CBS_E_DOWNLOAD_FAILURE']
eventIds: []
logFiles: ['%windir%\\Logs\\CBS\\CBS.log', '%windir%\\Logs\\DISM\\dism.log']
symptoms: ['The .NET Framework 3.5 payload cannot be downloaded from the configured source.', 'Windows Features, DISM, PowerShell, or Server feature installation fails with 0x800F0906.']
visibility: published
sources:
  - label: 'Microsoft: .NET Framework 3.5 installation errors'
    url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/application-management/dotnet-framework-35-installation-error'
  - label: 'Microsoft: .NET Framework 3.5 deployment errors'
    url: 'https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/net-framework-35-deployment-errors-and-resolution-steps?view=windows-11'
  - label: 'Microsoft: Features on Demand with WSUS or Configuration Manager'
    url: 'https://learn.microsoft.com/en-us/windows/deployment/update/fod-and-lang-packs'
  - label: 'Microsoft: install .NET Framework 3.5 on Windows 11'
    url: 'https://learn.microsoft.com/en-us/dotnet/framework/install/dotnet-35-windows-11'
  - label: 'Microsoft: install .NET Framework 3.5 on Windows'
    url: 'https://learn.microsoft.com/en-us/dotnet/framework/install/dotnet-35-windows'
---

## Short answer

For .NET Framework 3.5, Microsoft identifies `0x800F0906` as `CBS_E_DOWNLOAD_FAILURE`: Windows could not download the required feature files from its configured source. Start by identifying the Windows release and the source the device is meant to use. A working web browser does not by itself prove that Windows servicing can reach its configured update service or that policy allows this feature payload to come from there.

## Our diagnostic lens

Trace the payload route in order: **feature-install method → configured source → network or policy boundary → first download failure in the log**. This separates a network path issue from a managed source decision. It also prevents an unnecessary switch to installation media when the organization expects the device to download content from WSUS or Windows Update.

## What this code says

Microsoft's .NET 3.5 troubleshooting documentation associates 0x800F0906 with required files that could not be downloaded and identifies it as `CBS_E_DOWNLOAD_FAILURE`. That points to a failed payload retrieval, but it does not identify which network device, endpoint, proxy, firewall rule, or update policy caused it.

Keep nearby codes separate:

- `0x800F081F` is documented as a missing source-file condition. See [our 0x800F081F guide](/cases/windows-update-0x800f081f/).
- `0x800F0907` is documented as a policy-related failure to download required files. Use the code and logs actually recorded; do not infer it from 0x800F0906.
- `0x800F0950` is not assigned a specific meaning in Microsoft's listed .NET 3.5 error table. See [our cautious 0x800F0950 guide](/cases/dotnet-35-0x800f0950/).

## Check before changing the source

1. **Confirm the Windows release and build.** Run `winver` and record the edition, version, and build. Installation methods differ across releases.
2. **Identify how installation was started.** Record whether the attempt used Windows Features, DISM, PowerShell, Server Manager, an application prerequisite, or a management deployment.
3. **Find the intended source.** On a managed device, ask the administrator whether feature content should come from Windows Update, WSUS, Configuration Manager, or approved installation media. Do not change a managed policy locally.
4. **Correlate the failure time with the servicing logs.** Review `%windir%\\Logs\\CBS\\CBS.log` and, when DISM was used, `%windir%\\Logs\\DISM\\dism.log`. Note the first failed retrieval and any more specific error next to it. Remove company, tenant, user, device, and server identifiers before sharing excerpts.
5. **Check the relevant network route with the service owner.** The administrator should verify that the configured update source is reachable from the affected device and that proxy, firewall, and update-source rules permit the required servicing request. A successful browser test to an unrelated website is not a sufficient check.

## Select a remedy from the evidence

- **The intended online source is unavailable:** have the network or update administrator investigate the specific source and route shown by the failure. Retry after that path is restored.
- **Policy directs the request to a managed source:** verify that the selected source is expected to provide the feature payload. Microsoft notes that Windows version and update-source configuration affect Features on Demand. Do not blindly apply older policy instructions: Windows 11 22H2 and later changed how optional content is delivered through WSUS/UUP, and options were removed from the policy starting with Windows 11 24H2.
- **The organization intentionally uses offline media:** use Microsoft's supported procedure for the installed Windows release and a matching source. Microsoft warns that using source files from a different Windows version can produce an unsupported or unserviceable installation.
- **The device runs Windows 11 26H1 (build 28000) or later:** .NET 3.5 is installed with a release-specific standalone installer, not as a Windows component. Follow the dedicated [Windows 11 installation instructions](https://learn.microsoft.com/en-us/dotnet/framework/install/dotnet-35-windows-11).

## Verify the result

Retry the same installation method once after the identified source or route issue has been corrected. Confirm that .NET 3.5 is enabled or installed, and inspect the new log entries if the retry fails. If a different code appears, follow that code's specific guidance rather than repeating the same network or source change.

## Vendor sources

- [.NET Framework 3.5 installation errors](https://learn.microsoft.com/en-us/troubleshoot/windows-client/application-management/dotnet-framework-35-installation-error)
- [.NET Framework 3.5 deployment errors and resolution steps](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/net-framework-35-deployment-errors-and-resolution-steps?view=windows-11)
- [Features on Demand and language packs with WSUS or Configuration Manager](https://learn.microsoft.com/en-us/windows/deployment/update/fod-and-lang-packs)
- [Install .NET Framework 3.5 on Windows 11](https://learn.microsoft.com/en-us/dotnet/framework/install/dotnet-35-windows-11)
- [Install .NET Framework 3.5 on Windows](https://learn.microsoft.com/en-us/dotnet/framework/install/dotnet-35-windows)
