---
title: "Configuration Manager PXE certificate error 0x80092002"
slug: "configmgr-pxe-80092002-issuing-certificate-list"
description: "Investigate Configuration Manager PXE certificate encoding error 0x80092002 and the IssuingCertificateList registry value."
datePublished: 2026-10-07
dateModified: 2026-10-07
product: "Microsoft Configuration Manager"
vendor: "Microsoft"
versions: ["Microsoft Configuration Manager current branch"]
category: "Deployment"
tags: ["configuration-manager", "pxe", "certificate", "registry"]
errorCodes: ["0x80092002"]
eventIds: []
logFiles: ["SMSPXE.log"]
symptoms: ["PXE boot fails while the distribution point processes certificate information.", "SMSPXE.log reports that the certificate list cannot be encoded."]
visibility: published

sources:
  - label: "Microsoft: PXE boot does not work and reports 0x80092002"
    url: "https://learn.microsoft.com/en-us/troubleshoot/mem/configmgr/os-deployment/pxe-boot-not-work"
---
## Short answer

Microsoft documents a Configuration Manager PXE failure where the `IssuingCertificateList` registry value is missing under `HKLM\SOFTWARE\Microsoft\SMS\Security`. The relevant `SMSPXE.log` certificate-encoding error includes `0x80092002`. Confirm that exact signature and compare the affected distribution point with its management point before applying the documented registry repair.

## Symptoms and exact log signature

The log may report a certificate-list encoding failure with error `0x80092002`.

This can appear among other PXE messages. An unrelated `0x80070002` message about performance counters is not, by itself, the certificate issue described here.

## Environment

Microsoft Configuration Manager PXE-enabled distribution point. The affected registry path is:

`HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\SMS\Security`

The value discussed by Microsoft is `IssuingCertificateList`. Do not publish or copy certificate material from an unrelated site or environment.

## Evidence to collect

1. Save the relevant `SMSPXE.log` lines with timestamps and redact identifiers.
2. Check whether `IssuingCertificateList` exists on the affected distribution point and management point.
3. Compare the value on the management point associated with the same Configuration Manager site.
4. Record the site and server roles involved, without exposing real identifiers in public notes.
5. Take a supported system-state/registry backup and follow change control before editing a production server.

## Likely causes
In the documented scenario, the required `IssuingCertificateList` value is missing. Configuration Manager cannot encode the issuing-certificate list while processing PXE requests.

## Suggested troubleshooting steps
If the value exists on the correct management point, export that value and import it to the affected distribution point, following Microsoft’s procedure. The documented command pattern is:

```cmd
REG EXPORT "HKLM\SOFTWARE\Microsoft\SMS\Security" C:\SMS\Security.reg
```

Use the export/import process only after checking the exact value and ensuring the source is the management point for the same site. Review the exported file before importing; do not blindly replace the entire security key if unrelated values differ.

If the value is also missing from the management point, Microsoft documents retrieving the value from the site database and adding it to the management point and distribution point. That database operation is site-specific and should be performed only by an administrator who understands the supported procedure in the linked article. Do not run improvised SQL updates.

## How to check the result
After the approved change, restart or refresh the relevant Configuration Manager components only as directed by the vendor procedure. Re-run a controlled PXE test and confirm `SMSPXE.log` no longer shows the certificate-encoding failure and the client proceeds through boot image selection.

## Version notes

This procedure is tied to the Microsoft troubleshooting article and Configuration Manager role configuration. Confirm the current supported steps before use; certificate and site data must match the same environment.

## Sources

- [Microsoft: PXE boot does not work and reports 0x80092002](https://learn.microsoft.com/en-us/troubleshoot/mem/configmgr/os-deployment/pxe-boot-not-work)
