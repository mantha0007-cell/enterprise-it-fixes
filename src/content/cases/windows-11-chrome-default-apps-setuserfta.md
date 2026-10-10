---
title: "Windows 11 Chrome defaults with SetUserFTA"
slug: "windows-11-chrome-default-apps-setuserfta"
description: "Set Chrome for web links and supported file types in Windows 11, then choose the right supported deployment path for managed devices."
datePublished: 2026-10-08
dateModified: 2026-10-10
product: "Windows 11 and Google Chrome"
vendor: "Microsoft"
versions: ["Windows 11; available file and protocol handlers depend on installed applications and device policy"]
category: "Identity and access"
tags: ["Windows 11", "Google Chrome", "default apps", "file associations", "HTTP", "HTTPS", "SetUserFTA", "Group Policy"]
errorCodes: []
eventIds: []
logFiles: []
symptoms: ["Chrome opens web links but some file types still open in another app", "Need to deploy default app associations to managed Windows devices", "Considering SetUserFTA to automate per-user file associations"]
visibility: published
sources:
  - label: "Microsoft Support: Change default apps in Windows"
    url: "https://support.microsoft.com/en-us/windows/apps/change-default-apps-in-windows"
  - label: "Microsoft Learn: Windows app defaults platform"
    url: "https://learn.microsoft.com/en-us/windows/apps/develop/windows-integration/default-apps-platform"
  - label: "Microsoft Learn: Export or import default app associations"
    url: "https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/export-or-import-default-application-associations?view=windows-11"
  - label: "Microsoft Learn: ApplicationDefaults Policy CSP"
    url: "https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-applicationdefaults"
  - label: "SetUserFTA: Personal Edition documentation"
    url: "https://setuserfta.com/personal-edition-documentation/"
  - label: "SetUserFTA: Licensed Edition documentation"
    url: "https://setuserfta.com/setuserfta-2-0-documentation/"
  - label: "SetUserFTA: Product and editions"
    url: "https://setuserfta.com/"
---

## Short answer

In Windows 11, set Chrome separately for the link protocols and file types you want it to open. Start in **Settings → Apps → Default apps → Google Chrome**, then review the individual entries. Making Chrome the browser does not mean that every file type, such as PDF, has also been assigned to it. For managed devices, use the organization’s tested Group Policy, MDM, or Windows image process. Treat SetUserFTA as a third-party option that needs its own version, licensing, and security review.

## Decide what should open in Chrome

There are two related but separate choices:

| What you want | Examples to review in Default apps |
|---|---|
| Web links open in Chrome | `HTTP` and `HTTPS` |
| Web documents open in Chrome | `.htm` and `.html`, if Chrome is listed for them |
| Documents or images open in Chrome | A specific extension such as `.pdf`, `.svg`, or `.webp`, only if Chrome is offered as a handler |

The available list depends on what each installed application registered with Windows. If Chrome does not appear for an extension, Windows is not currently offering it as a handler for that type. Do not assume that changing the browser also changes every document or image association.

## Set Chrome for the current user

1. Press **Windows + R**, type `ms-settings:defaultapps`, and press **Enter**. You can also open **Start → Settings → Apps → Default apps**.
2. Search for and select **Google Chrome**.
3. Use **Set default** if Windows offers it, then inspect the list of file types and link types on Chrome’s page.
4. For any remaining type you want to change, select that entry and choose Chrome if it is offered.
5. Test a web link and each important file type separately. Check the Windows page again if an association did not persist.

Windows requires supported system UI for user-selected defaults. A command that changes a registry value, or a successful script exit code, does not prove that Windows accepted and kept the intended association.

## Deploy defaults to managed PCs

For organization-wide defaults, first configure the desired associations on a representative Windows image or test device. Microsoft documents exporting the associations with DISM and applying an XML configuration through Windows deployment, Group Policy, or the ApplicationDefaults MDM policy.

Plan the policy’s behavior before rollout. The MDM policy applies configured associations at sign-in, and Windows 11 can distinguish associations that should be suggested once from those re-applied at every sign-in. A policy that repeatedly applies defaults can overwrite choices users make later. Test the exact Windows build, Chrome installation, account type, and policy precedence with a pilot group before expanding deployment.

For a single-user repair on a managed PC, check whether GPO or MDM is enforcing the association. If it is, changing Settings locally may not persist; ask the administrator to update the managed configuration rather than repeatedly resetting the user’s defaults.

## Where SetUserFTA fits

SetUserFTA is a third-party utility for per-user file and protocol associations. Its vendor publishes separate documentation for a Personal Edition and a licensed edition; the vendor describes the Personal Edition as unsupported and for non-commercial use. Check the current edition terms and exact documentation before using or deploying it.

Microsoft’s documented Windows methods are Settings for user choice and policy or image configuration for managed deployment. SetUserFTA is a separate vendor-specific automation path. Before considering it in a business environment, have the administrator review its licensing, security approval, execution context, version-specific syntax, and interaction with Windows or organization policy. Test a narrow set of associations on a disposable or pilot profile first. Do not run an unreviewed script that changes every file type Chrome has registered.

## Avoid direct registry edits

Windows protects the per-user default choice. Editing `UserChoice` values directly is not a supported way to make a default-app change, and the registry data alone is not a complete backup or reliable proof of what Windows will use. Use the Settings page to verify a user’s choice. For a managed rollout, inspect the policy and the actual behavior after sign-in.

## A safe verification sequence

1. In Settings, confirm Chrome is selected for `HTTP` and `HTTPS`.
2. Check the exact extensions your users need; do not change unrelated types simply because Chrome supports opening them.
3. Open a link and a representative file of each targeted type.
4. Sign out and back in, or refresh the device’s policy as appropriate, then repeat the test.
5. If the choice changes back, check for a Group Policy, MDM assignment, application update, or image-level default before trying another tool.

## Microsoft and vendor sources

- [Change default apps in Windows](https://support.microsoft.com/en-us/windows/apps/change-default-apps-in-windows)
- [Windows app defaults platform](https://learn.microsoft.com/en-us/windows/apps/develop/windows-integration/default-apps-platform)
- [Export or import default app associations](https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/export-or-import-default-application-associations?view=windows-11)
- [ApplicationDefaults Policy CSP](https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-applicationdefaults)
- [SetUserFTA Personal Edition documentation](https://setuserfta.com/personal-edition-documentation/)
- [SetUserFTA licensed edition documentation](https://setuserfta.com/setuserfta-2-0-documentation/)
- [SetUserFTA product and editions](https://setuserfta.com/)

Association availability and deployment behavior depend on the Windows release, installed application registrations, and device management policies. Validate the intended result on the target configuration before broad deployment.
