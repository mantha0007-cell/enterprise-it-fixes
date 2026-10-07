---
title: 'Windows Update 0x80070005: find what is denying access'
slug: windows-update-0x80070005-access-denied
description: 'Treat 0x80070005 as an access-denied symptom: identify the blocked file, registry key, policy, or security filter before repairing permissions.'
datePublished: 2026-10-07
dateModified: 2026-10-07
product: 'Windows Update'
vendor: 'Microsoft'
versions: ['Supported Windows client, Windows Server, and Azure VM versions']
category: 'Windows servicing'
tags: ['Windows Update', 'access denied', 'permissions', 'CBS', 'TrustedInstaller']
errorCodes: ['0x80070005', 'E_ACCESSDENIED']
eventIds: []
logFiles: ['WindowsUpdate.log', '%windir%\\Logs\\CBS\\CBS.log']
symptoms: ['Servicing stops when Windows Update cannot open or create a required object.', 'A CBS or Windows Update log records an access-denied result.']
visibility: published

sources:
  - label: 'Microsoft: troubleshoot Windows Update error 0x80070005'
    url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/installing-updates-features-roles/troubleshoot-windows-update-error-0x80070005'
  - label: 'Microsoft: common Windows Update errors'
    url: 'https://learn.microsoft.com/en-us/troubleshoot/windows-client/installing-updates-features-roles/common-windows-update-errors'
---

## Short answer

0x80070005 means E_ACCESSDENIED; it does not name one universal broken permission. Correlate the failure time with CBS.log or WindowsUpdate.log, identify the object being denied, and then repair that specific cause. Microsoft lists component-store permissions, TrustedInstaller ownership, security software, SYSTEM rights, and management policy as possible causes. Back up the OS disk before permission repairs.

## Our diagnostic lens

Anchor the investigation on the **first denied object at the failure timestamp**. A path under servicing, a registry location, and an operation intercepted by endpoint software lead to different owners and remedies. Capture the surrounding log lines, identify the process and target if available, then inspect only that object's access path. This is why a broad permission reset is a poor first move: it changes many controls without telling you which one caused the denial.


## Problem / symptoms

An update installation fails and the update or Component-Based Servicing log records 0x80070005, often beside a file or package operation that could not be opened or created.

## Exact error

> 0x80070005 (E_ACCESSDENIED)

## Environment and scope

Supported Windows client, Windows Server, and Azure VM systems. The relevant object can be a folder, registry key, servicing component, or resource intercepted by a security product or management policy.

## Investigation

1. Record the update KB, timestamp, OS build, and whether the device is managed by WSUS, Intune, Configuration Manager, or another agent.
2. Generate a readable Windows Update log with Get-WindowsUpdateLog if needed. Inspect the matching timestamp in it and %windir%\Logs\CBS\CBS.log.
3. Locate the first relevant access-denied operation and the file, registry key, or service involved. Microsoft specifically calls out %windir%\WinSxS, %windir%\SoftwareDistribution, the Component Based Servicing registry key, SYSTEM permissions, TrustedInstaller, and third-party security filters.
4. Check recent GPO, endpoint-security, ACL, or servicing changes. Avoid changing permissions on unrelated system paths.

## Likely causes
The Windows Update/servicing process lacks access to a required object, or another product or policy blocks the operation. The same error code can result from different objects, so applying a blanket ACL reset without checking the log can obscure the actual cause.

## Suggested troubleshooting steps
Use the repair step that matches the denied object and follow Microsoft's sequence. Their article begins with backing up the OS disk, then covers component-store ACLs, TrustedInstaller ownership, Windows Update component reset, DISM/SFC repair, and third-party interference. The published recursive icacls commands alter permissions across servicing directories; review the target, take a backup, and test on one affected device before fleet deployment. Do not disable endpoint protection across a fleet as a default fix.

## How to check the result
- Retry the failed update after the specific permission or blocking cause is corrected.
- Confirm the same log operation no longer returns E_ACCESSDENIED.
- Confirm the update reaches its expected installed state after any required restart.
- If the failure persists, re-read the new log entries; the first denial may have been only one of several problems.

## Vendor sources

- [Troubleshoot Windows Update error 0x80070005](https://learn.microsoft.com/en-us/troubleshoot/windows-client/installing-updates-features-roles/troubleshoot-windows-update-error-0x80070005)
- [Common Windows Update errors](https://learn.microsoft.com/en-us/troubleshoot/windows-client/installing-updates-features-roles/common-windows-update-errors)
