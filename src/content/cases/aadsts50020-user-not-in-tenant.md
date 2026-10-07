---
title: 'AADSTS50020: troubleshoot a Microsoft Entra account or tenant mismatch'
slug: aadsts50020-user-not-in-tenant
description: 'AADSTS50020 means the identity presented for sign-in is not recognized in the resource tenant; verify the account, tenant, app type, and guest invitation.'
datePublished: 2026-10-07
dateModified: 2026-10-07
product: 'Microsoft Entra ID'
vendor: 'Microsoft'
versions: ['Microsoft Entra B2B collaboration and Microsoft identity platform; behavior depends on app and tenant configuration']
category: 'Identity and access'
tags: ['authentication', 'B2B collaboration', 'guest users', 'tenant ID', 'sign-in logs']
errorCodes: ['AADSTS50020', '90072']
eventIds: []
logFiles: ['Microsoft Entra sign-in logs']
symptoms: ['An authenticated user cannot enter the directory that hosts the requested resource.', 'The identity in the browser session differs from the invited or intended account.']
visibility: published

sources:
  - label: 'Microsoft: troubleshoot AADSTS50020'
    url: 'https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/app-integration/error-code-aadsts50020-user-account-identity-provider-does-not-exist'
  - label: 'Microsoft: add B2B collaboration users'
    url: 'https://learn.microsoft.com/en-us/entra/external-id/add-users-administrator'
  - label: 'Microsoft: troubleshoot Entra sign-in errors'
    url: 'https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors'
---

## Short answer

AADSTS50020 means Microsoft Entra ID could not match the identity presented by the user to an account that can access the resource tenant. First confirm which account and tenant the sign-in request actually used. If the user is meant to be an external guest, check that the guest exists in the resource tenant and that the invitation was redeemed by the expected identity. Do not invite the same person repeatedly or change app account types until you have checked the failed sign-in details.

## Our diagnostic lens

Follow the identity through this chain and stop at the first mismatch: **person choosing an account → identity provider → authority/tenant endpoint → resource tenant → tenant-local guest or member → application access rule**. A mismatch near the beginning calls for correcting the account or request target; a missing guest record matters only when the design expects guest access; an assignment gate is a separate check at the end. This order helps avoid duplicate invitations and unnecessary changes to app audience settings.


## Problem / symptoms

A user can authenticate with an identity provider but is rejected when opening an application or resource in another Microsoft Entra tenant. The message may indicate that the resource directory has no matching external identity. A related home-tenant sign-in record can show error 90072; check the named identity and directory before sending another invitation.

## Exact error

> AADSTS50020: the sign-in identity is not recognized in the resource tenant.

The full error identifies an account, identity provider, resource tenant, and often the application. Treat tenant names, user addresses, app IDs, and correlation details as sensitive when sharing the message.

## Environment and scope

Microsoft Entra sign-ins to applications or resources in a resource tenant, including B2B guest access. The same code can arise from different account, tenant, app-registration, and invitation conditions; it does not by itself prove that the user simply needs a new invitation.

## What the evidence establishes

Microsoft documents causes that include using the wrong account or tenant, an app that does not support the identity type, a guest who was not invited, and app assignment requirements. The error text narrows the investigation to the identity and resource tenant, but the sign-in record and app configuration determine which cause applies.

## Investigation

1. Capture the exact error, timestamp, correlation ID, application, identity provider, and resource tenant. In Entra ID, inspect the matching failed sign-in; also check the home-tenant sign-in if the error points to a guest account.
2. Confirm the browser selected the intended work, school, or personal account. Sign out of the wrong session or use a private browser window to test the intended identity without stale account selection.
3. Check the app registration's supported account types and the authority or tenant in the request. A single-tenant app cannot accept identities from other directories as if it were multitenant.
4. If this is B2B access, search the resource tenant for the guest using the expected external identity. Check invitation status and whether redemption used a different account than the one now signing in.
5. Review whether the enterprise application requires user assignment. If it does, verify the expected user or group assignment; assignment problems can have their own sign-in error.

## Likely causes
The identity provider has authenticated an account, but the tenant receiving the resource request cannot resolve that identity as an authorized tenant-local or invited external user for the application. A wrong tenant endpoint, unsupported account type, missing or mismatched guest invitation, or assignment requirement can lead to this result.

## Suggested troubleshooting steps
Correct the account selection or tenant authority if the request targets the wrong identity or directory. For intended guest access, invite the correct external identity into the resource tenant and have that user redeem the invitation with that identity. If the app is intended to accept accounts from other tenants, confirm its account type and sign-in endpoint support that design. Assign access only when the application's intended access policy requires it. Do not broaden a single-tenant app or remove assignment controls merely to suppress the error.

## How to check the result
- Repeat the sign-in with the intended identity and resource tenant.
- Confirm the matching sign-in event names the expected user, application, and tenant and no longer reports AADSTS50020.
- For a guest invitation, verify that the expected guest object and redemption identity are present in the resource tenant.
- Confirm the user receives only the access intended for the application.

## Vendor sources

- [Troubleshoot AADSTS50020](https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/app-integration/error-code-aadsts50020-user-account-identity-provider-does-not-exist)
- [Add B2B collaboration users](https://learn.microsoft.com/en-us/entra/external-id/add-users-administrator)
- [Troubleshoot Microsoft Entra sign-in errors](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors)
