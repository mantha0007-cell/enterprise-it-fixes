---
title: "Set Up a Windows Hello PIN in Windows 11"
slug: "set-up-windows-hello-pin-windows-11"
description: "Set up or reset a Windows Hello PIN in Windows 11, and troubleshoot unavailable options on a managed work device without risky credential resets."
datePublished: 2026-10-08
dateModified: 2026-10-08
product: "Windows 11"
vendor: "Microsoft"
versions: ["Windows 11; exact release and device management configuration can affect available options"]
category: "Identity and access"
tags: ["Windows 11", "Windows Hello", "Windows Hello for Business", "PIN", "sign-in options", "Microsoft Intune", "Microsoft Entra ID", "TPM"]
errorCodes: []
eventIds: []
logFiles: []
symptoms: ["Need to create a Windows sign-in PIN", "The Windows Hello PIN setup or reset option is unavailable", "A PIN is forgotten or no longer works"]
visibility: published
sources:
  - label: "Microsoft Support: Configure Windows Hello"
    url: "https://support.microsoft.com/en-gb/windows/security/configure-windows-hello"
  - label: "Microsoft Support: Change or reset your PIN in Windows"
    url: "https://support.microsoft.com/en-us/windows/security/change-or-reset-your-pin-in-windows"
  - label: "Microsoft Learn: Windows Settings URI reference"
    url: "https://learn.microsoft.com/en-us/windows/apps/develop/launch/launch-settings"
  - label: "Microsoft Learn: Windows Hello for Business policy settings"
    url: "https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/policy-settings"
  - label: "Microsoft Learn: Windows Hello for Business FAQ"
    url: "https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/faq"
---

## Short answer

Open **Settings → Accounts → Sign-in options**, choose **PIN (Windows Hello)**, and select **Set up**. Verify your identity when prompted, then enter and confirm the PIN. On a work or school PC, the available choices can be controlled by Windows Hello for Business policy and device enrollment; a missing button does not by itself prove that the TPM or device registration is broken.

## Set up the PIN

1. Open **Start → Settings → Accounts → Sign-in options**.
2. Expand **PIN (Windows Hello)**. If the option is available, select **Set up**.
3. Confirm your account using the method Windows requests. This may involve your account password or another verification step.
4. Enter a PIN, confirm it, and finish the setup prompt.
5. Lock the PC and test the PIN at the sign-in screen. Keep another sign-in method available until you know the new PIN works.

To jump to the same settings page, press **Windows + R**, enter `ms-settings:signinoptions`, and press **Enter**. The Settings URI is a shortcut to the page; it does not bypass account verification or organization policy.

## What the PIN is for

A Windows Hello PIN is a sign-in method associated with the Windows device. It is separate from the password for the Microsoft account or work account. Windows Hello for Business on an organization-managed device can provision a stronger sign-in credential whose setup and recovery depend on the organization's configuration. Do not treat a work PIN as an ordinary local convenience setting if the device is managed.

## Change or reset a PIN

If you know the current PIN, open **Settings → Accounts → Sign-in options → PIN (Windows Hello) → Change PIN** and follow the prompts.

If you forgot it but can still sign in another way, use **I forgot my PIN** in Sign-in options if Windows offers it. Verify the account and create a replacement. If you are at the lock screen, choose **I forgot my PIN** only if that option appears for the selected account. Some account types and managed configurations require signing in with a password first or contacting the organization’s IT support.

## If Set up is missing or unavailable

Check the situation before changing device security settings:

1. **Confirm which account is selected.** Personal Microsoft accounts, local accounts, and work or school accounts can have different recovery and setup options.
2. **Check whether the PC is managed.** On a work or school device, Windows Hello for Business may be required, disabled, or waiting for an organization policy or enrollment step. Ask the device administrator to check the applied configuration and provisioning status.
3. **Separate a policy issue from a hardware issue.** A TPM can be part of a Windows Hello for Business deployment, but the symptom alone does not identify a TPM failure. Follow the organization's supported diagnostic process before changing TPM state or device join status.
4. **Use the available sign-in method.** If a PIN reset option is absent, sign in with the account password or another offered credential and then check Sign-in options again. If that is not possible, use Microsoft’s account recovery or contact the organization’s support team.

Windows settings vary with device configuration, and organizations can manage sign-in options centrally. On a managed PC, have the administrator review the effective policy instead of enabling a convenience PIN as a workaround for a Windows Hello for Business enrollment problem.

## Avoid broad Hello-container resets

Do not use `certutil -deletehellocontainer`, clear Hello-related folders, reset the TPM, or disconnect the device from Microsoft Entra ID as a first troubleshooting step. These actions can remove Windows Hello credentials and may affect other credentials stored on the device. Microsoft notes that current Windows 11 versions can also remove passkeys stored in the Hello container when it is deleted. Use the documented PIN recovery flow or an administrator-approved recovery procedure instead.

## Quick decision guide

- **New PIN on a personal PC:** use Sign-in options and follow the setup wizard.
- **Forgotten PIN, but Windows sign-in still works:** use **I forgot my PIN** in Settings when available.
- **Forgotten PIN at the lock screen:** use the lock-screen reset option if shown; otherwise sign in with another credential first.
- **Work device with a missing or blocked option:** ask IT to check Windows Hello for Business policy and provisioning for that device and account.
- **Considering a TPM or Hello-container reset:** stop and check the supported recovery method first, particularly if the device stores passkeys or work credentials.

## Microsoft sources

- [Configure Windows Hello](https://support.microsoft.com/en-gb/windows/security/configure-windows-hello)
- [Change or reset your PIN in Windows](https://support.microsoft.com/en-us/windows/security/change-or-reset-your-pin-in-windows)
- [Windows Settings URI reference](https://learn.microsoft.com/en-us/windows/apps/develop/launch/launch-settings)
- [Windows Hello for Business policy settings](https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/policy-settings)
- [Windows Hello for Business FAQ](https://learn.microsoft.com/en-us/windows/security/identity-protection/hello-for-business/faq)

The exact labels and recovery options can vary by Windows release, account type, and organization policy. Use the linked Microsoft guidance for the device’s specific configuration.
