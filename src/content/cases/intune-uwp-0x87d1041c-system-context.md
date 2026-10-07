---
title: "Intune UWP app reports 0x87D1041C after System-context installation"
slug: "intune-uwp-0x87d1041c-system-context"
description: "Understand Intune error 0x87D1041C for a Microsoft Store UWP app already installed for a user when deployment runs in System context."
datePublished: 2026-10-07
dateModified: 2026-10-07
product: "Microsoft Intune"
vendor: "Microsoft"
versions: ["Microsoft Intune", "Windows 10 and Windows 11; behavior depends on package"]
category: "Endpoint Management"
tags: ["intune", "uwp", "microsoft-store", "system-context"]
errorCodes: ["0x87D1041C"]
eventIds: []
logFiles: ["Intune Management Extension logs", "Company Portal app status"]
symptoms: ["Intune reports that the application was not detected after installation.", "The Store app is visible or launchable for a user despite a failed status."]
visibility: published

sources:
  - label: "Microsoft: Add Microsoft Store apps in Intune"
    url: "https://learn.microsoft.com/en-us/intune/app-management/deployment/add-microsoft-store"
---
## Short answer

For the documented Microsoft Store app scenario, error `0x87D1041C` can occur when an app is already installed for a user but Intune deploys it in System context. The reported failure can reflect the mismatch between user-scoped app state and System-context detection; it does not by itself prove that the app is absent or that installation failed.

## Symptoms

- Intune reports that the application was not detected after installation.
- The app appears available to a signed-in user.
- The deployment uses System install behavior for a Microsoft Store (new) app.

## Exact error

`0x87D1041C` — the application was not detected after installation completed.

Use the full app installation status and associated management logs. This guide addresses the specific Store/UWP context described by Microsoft, not every Win32 deployment with the same code.

## Environment and scope

Microsoft Store app (new) deployments in Intune, especially UWP apps with user-specific installation state. Package type, assignment intent, and install behavior matter.

## Evidence to collect

1. Record the app type, package identity, assignment, install behavior, and affected user/device scope.
2. Confirm whether the app is installed for the signed-in user and whether it is registered for other users or the device.
3. Compare the Intune deployment context with the intended user or device installation model.
4. Review the app’s Intune status and relevant management logs for the same timestamp.
5. Check the linked Microsoft article for the current limitations and behavior of that Store app deployment type.

## Likely causes
Microsoft documents a case where an app already installed for any user can cause a System-context deployment to report `0x87D1041C`. The code is a detection result; on its own, it does not distinguish this context issue from a genuine installation or detection problem.

## Suggested troubleshooting steps
Choose a deployment context that matches the app’s supported installation scope and the organization’s assignment design. If the app is intentionally user-scoped, use an appropriate user-targeted deployment where supported. If device-wide installation is required, verify the package supports it and test the behavior on a clean, representative device before changing a broad assignment.

Do not uninstall the app for every user or alter detection rules solely because this code appeared. First verify package-specific Microsoft guidance and the device’s actual app registration.

## How to check the result
On a controlled test device, use the intended assignment and context. Confirm installation scope, launchability for the intended user, and the resulting Intune status after the next reporting cycle. Compare with a clean device if the app pre-existed.

## Version notes

Store package behavior and Intune options evolve. Confirm current app-type support, install behavior, and OS requirements in the linked documentation before rollout.

## Sources

- [Microsoft: Add Microsoft Store apps in Intune](https://learn.microsoft.com/en-us/intune/app-management/deployment/add-microsoft-store)
