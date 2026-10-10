---
title: '0x800f081f: missing .NET 3.5 source'
slug: windows-update-0x800f081f
description: 'Diagnose 0x800f081f during Windows repair or .NET Framework 3.5 setup by checking the missing payload, source path, and Windows version match.'
datePublished: 2026-10-07
dateModified: 2026-10-10
product: 'Windows Update and Component-Based Servicing'
vendor: 'Microsoft'
versions: ['Supported Windows client and Server versions; see linked Microsoft applicability']
category: 'Windows servicing'
tags: ['Windows Update', '.NET Framework 3.5', 'NetFx3', 'DISM', 'SFC', 'component store', 'CBS']
errorCodes: ['0x800f081f', 'CBS_E_SOURCE_MISSING']
eventIds: []
logFiles: ['%windir%\\Logs\\CBS\\CBS.log', '%windir%\\Logs\\DISM\\dism.log']
symptoms: ['The source files could not be found', 'ResolveSource() unsuccessful', 'A Windows update or feature repair fails']
visibility: published

sources:
  - label: 'Microsoft: common Windows Update errors'
    url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/installing-updates-features-roles/common-windows-update-errors'
  - label: 'Microsoft: repair a Windows image'
    url: 'https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/repair-a-windows-image'
  - label: 'Microsoft: .NET Framework 3.5 installation errors'
    url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/application-management/dotnet-framework-35-installation-error'
  - label: 'Microsoft: install .NET Framework 3.5 on Windows'
    url: 'https://learn.microsoft.com/en-us/dotnet/framework/install/dotnet-35-windows'
  - label: 'Microsoft: install .NET Framework 3.5 on Windows 11'
    url: 'https://learn.microsoft.com/en-us/dotnet/framework/install/dotnet-35-windows-11'
---

## Short answer

0x800f081f is CBS_E_SOURCE_MISSING: Windows servicing could not find a required payload. First identify what was being installed or repaired. A component-store repair and enabling the optional .NET Framework 3.5 feature use different source paths, so the right next check depends on the failed operation. Match any offline source to the target Windows version and follow Microsoft's current version-specific instructions.

## Our diagnostic lens

Think of repair as a source-selection problem with three links: **the damaged component the log names → the source Windows is configured to use → a payload in that source that matches the target image**. DISM succeeding or failing is useful only when you know which source it consulted. If using media, confirm the correct image index and servicing compatibility instead of cycling through unrelated ISOs. This narrows the next action to source policy, image matching, or the missing payload itself.


## Problem / symptoms

A cumulative update, feature installation, or component repair fails and the servicing logs contain 0x800f081f, CBS_E_SOURCE_MISSING, or ResolveSource() unsuccessful.

## Environment and scope

Windows component-based servicing on supported Windows client or Server versions. The exact repair source and DISM options depend on the OS image, update source policy, and whether the device can reach Microsoft Update or WSUS.

## When .NET Framework 3.5 (NetFx3) is the failed feature

If the code appeared while enabling .NET Framework 3.5 from Windows Features, DISM, PowerShell, or a Server feature workflow, treat it first as a missing optional-feature payload. The error by itself does not show that the whole component store needs repair.

On supported Windows versions that provide NetFx3 as an optional feature, check whether the device is allowed to download optional-feature files from Windows Update. In a managed environment, the configured repair source or policy may direct the request to WSUS; ask the device administrator to verify the optional component installation and repair policy before changing it.

If the organization uses installation media as the source, verify that `\sources\sxs` exists, is readable by the device, and matches the target Windows version. Microsoft documents the supported DISM syntax and Server-specific installation methods in its linked error-resolution article. Use that version-specific procedure rather than copying a source path or image from another Windows release.

Use this only where the installed Windows version supports NetFx3 as an optional feature. Windows 11 version 26H1, build 28000 and later, uses a standalone .NET Framework 3.5 installer; follow Microsoft's current installation page for that release instead of this optional-feature command. Windows Server has its own feature-installation workflow and source requirements; use the linked deployment guidance for the installed Server version.

This gives a focused check: confirm the failed operation, make the payload available through the configured update source or a matching installation source, then retry once and inspect the servicing log if it still fails.

## What the evidence establishes

Microsoft describes the code as a missing source for a package or file and recommends repairing the component store with DISM, followed by SFC. The code alone does not identify which package payload is missing or prove that any arbitrary ISO is a valid source.

## Investigation

1. Note the failed update/feature, OS edition and build, servicing source policy, and the timestamp of the failure.
2. Check %windir%\Logs\CBS\CBS.log and %windir%\Logs\DISM\dism.log around that timestamp for the package or payload that could not be resolved.
3. Confirm the device can use its configured repair source. Managed devices may be directed to WSUS or another source by policy.
4. If using installation media, check that the image contains the exact edition and a compatible servicing level. Identify the correct image index instead of assuming index 1.

## Likely causes
The component store repair operation cannot obtain one or more required files from its configured source. Corruption may be involved, but an unavailable or unsuitable source can produce the same code.

## Solution

From an elevated Command Prompt, run the vendor-recommended repair sequence:

    DISM.exe /Online /Cleanup-Image /RestoreHealth
    sfc /scannow

Restart if requested, then retry the failed update. By default, DISM may use Windows Update as its repair source. Where that source is unavailable, follow Microsoft's Windows image repair guidance to specify a matching local or network source and the correct WIM/ESD index. Do not guess an index or use media from a different release.

For a NetFx3 feature-installation failure, use the preceding section's source checks; `RestoreHealth` alone does not supply the optional feature payload.

## How to check the result
- Confirm DISM completes successfully and record its exit/result details.
- Confirm SFC completes and reports whether it repaired files or found no integrity violations.
- Retry the same update or feature and check CBS.log for the original source-missing failure.
- If the code remains, use the logs to identify the specific missing payload and source path; do not repeat the same repair blindly.

## Vendor sources

- [Common Windows Update errors](https://learn.microsoft.com/en-us/troubleshoot/windows-client/installing-updates-features-roles/common-windows-update-errors)
- [Repair a Windows image](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/repair-a-windows-image)
- [.NET Framework 3.5 installation errors](https://learn.microsoft.com/en-us/troubleshoot/windows-client/application-management/dotnet-framework-35-installation-error)
- [Install .NET Framework 3.5 on Windows](https://learn.microsoft.com/en-us/dotnet/framework/install/dotnet-35-windows)
- [Install .NET Framework 3.5 on Windows 11](https://learn.microsoft.com/en-us/dotnet/framework/install/dotnet-35-windows-11)
