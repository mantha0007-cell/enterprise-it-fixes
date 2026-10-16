---
title: "PowerShell blocks a VPN support script: check policy before changing it"
slug: "powershell-execution-policy-vpn-script-blocked"
description: "Diagnose a PowerShell script blocked by Execution Policy, distinguish Group Policy from local settings, and verify a VPN support script safely."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "Windows PowerShell"
vendor: "Microsoft"
versions: ["Windows PowerShell on Windows; PowerShell 7 uses separate configuration settings"]
category: "Endpoint Management"
tags: ["powershell", "execution-policy", "vpn", "barracuda", "script-signing", "group-policy", "security"]
errorCodes: ["UnauthorizedAccess"]
eventIds: []
logFiles: ["PowerShell error output", "Group Policy results, if applicable"]
symptoms: ["A VPN support script stops before its own code starts", "PowerShell reports that running scripts is disabled", "A temporary execution-policy change has no effect on a managed Windows device"]
visibility: published
sources:
  - label: "Microsoft Learn: about_Execution_Policies"
    url: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.5"
  - label: "Microsoft Learn: Set-ExecutionPolicy"
    url: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-5.1"
  - label: "Microsoft Learn: Get-AuthenticodeSignature"
    url: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-authenticodesignature?view=powershell-7.5"
  - label: "Microsoft Learn: Unblock-File"
    url: "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/unblock-file?view=powershell-7.5"
---

## Short answer

If PowerShell says scripts are disabled, it blocked the file before its code ran. That points to an execution-policy decision; it does not show whether the VPN support script itself is correct or safe. On a managed work computer, first inspect the effective policy and verify the script's origin and contents. Do not begin by setting `Bypass` or changing a machine-wide policy.

## What this error tells you

Execution Policy controls the conditions under which PowerShell loads scripts. Windows PowerShell may report `UnauthorizedAccess` and a message that running scripts is disabled. Since the block occurs before the script body executes, a later VPN connection problem has not yet been tested.

Execution Policy is a safety feature, not a complete security boundary. It can reduce accidental script execution, but it does not prove a script is trustworthy when a policy allows it to run. Treat script provenance, signature, contents, and the organization's application controls as separate checks.

## Inspect policy without changing it

In the same PowerShell edition that produced the error, run:

```powershell
$PSVersionTable.PSEdition
$PSVersionTable.PSVersion
Get-ExecutionPolicy -List
Get-ExecutionPolicy
```

The list shows settings for `MachinePolicy`, `UserPolicy`, `Process`, `CurrentUser`, and `LocalMachine`. Group Policy scopes take precedence over local settings. If `MachinePolicy` or `UserPolicy` is configured, a local change or process-level setting does not override that organization policy. Give the results and the exact error to the administrator who owns the endpoint policy.

Also confirm which PowerShell host launched the file. Windows PowerShell (`powershell.exe`) and PowerShell 7 (`pwsh.exe`) maintain separate settings on Windows, so a result from one host may not describe the other.

## Verify the VPN support script before running it

The script name or the fact that it mentions a VPN vendor does not establish who created it. Confirm the download location and intended purpose with the support team or software owner. Read the script, check that its actions match the stated purpose, and verify its Authenticode signature and hash where the publisher provides a trusted reference.

These commands inspect a file without executing it:

```powershell
Get-AuthenticodeSignature -LiteralPath "C:\Path\To\SupportScript.ps1" |
    Format-List Status,StatusMessage,SignerCertificate

Get-FileHash -Algorithm SHA256 -LiteralPath "C:\Path\To\SupportScript.ps1"
```

A valid signature identifies the signer but does not guarantee that every action in the script is appropriate for this device. An unsigned script is not automatically malicious, but do not treat it as trusted without independent verification. If there is no publisher signature or reference hash, ask the author or administrator to validate the exact file through an approved channel.

## Choose the next step based on the findings

### An organization policy is enforcing the block

Do not try to bypass the policy. Ask the endpoint or security administrator to confirm whether the script is approved and select the supported deployment or execution method. If the rule needs an exception, have the owner scope, approve, and document it according to organizational policy.

### No Group Policy scope is set

Check whether the file is blocked because it came from the internet and whether the effective policy is `RemoteSigned`. Microsoft documents `Unblock-File` as a way to remove a downloaded file's zone marker, but also says to review the source and verify the file is safe first. Do not unblock an unreviewed support script. If the script is managed by IT, have its owner determine whether unblocking, signing, or a different approved package is appropriate.

Changing the Process scope is temporary and ends with that PowerShell process, but `Bypass` removes script restrictions and prompts for that process. It should not be used as a generic fix for an unexplained block or as a way around Group Policy. Prefer an approved, signed, or centrally deployed script path.

## Confirm the result in two stages

1. First confirm that the approved script starts without the original policy error.
2. Then evaluate the script's own output and verify the intended VPN behavior independently.

If a new error appears after the policy block is resolved, record it separately. It may be a script, permissions, client, network, or VPN configuration issue; the original message alone cannot distinguish among those causes.

## Common mistakes

- **“The VPN client is broken.”** The error occurs before the script runs, so it does not diagnose the VPN connection.
- **“Process Bypass always works.”** Group Policy scopes override local policy choices.
- **“Execution Policy is antivirus.”** Microsoft describes it as a safety feature, not a security boundary.
- **“A signed script is automatically safe.”** A signature verifies publisher identity and integrity; the script's actions still need review.
- **“The fix succeeded because PowerShell accepted a command.”** Confirm the script start and the VPN outcome as separate checks.

## Sources

- [about_Execution_Policies](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.5)
- [Set-ExecutionPolicy](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-5.1)
- [Get-AuthenticodeSignature](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.security/get-authenticodesignature?view=powershell-7.5)
- [Unblock-File](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/unblock-file?view=powershell-7.5)

This guide covers the PowerShell policy error only. It does not confirm the origin, safety, successful execution, or behavior of any particular VPN script. Follow your organization's endpoint policy and verify the current Microsoft guidance before making policy changes.
