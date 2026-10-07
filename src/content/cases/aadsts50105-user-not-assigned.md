---
title: 'AADSTS50105: assign the user to the Microsoft Entra enterprise app'
slug: aadsts50105-user-not-assigned
description: 'AADSTS50105 means the enterprise app requires assignment and the signed-in user lacks a qualifying assignment; verify the access policy before changing it.'
datePublished: 2026-10-07
dateModified: 2026-10-07
lastReviewed: 2026-10-07
product: 'Microsoft Entra ID'
vendor: 'Microsoft'
versions: ['Microsoft Entra enterprise applications using SAML, OpenID Connect, OAuth 2.0, WS-Federation, or Application Proxy']
category: 'Identity and access'
tags: ['authentication', 'enterprise applications', 'app assignment', 'application roles', 'sign-in logs']
errorCodes: ['AADSTS50105']
eventIds: []
logFiles: ['Microsoft Entra sign-in logs']
symptoms: ['The signed-in user is not assigned to a role for the application', 'User cannot sign in to an enterprise application']
status: documented
verified: false
sources:
  - label: 'Microsoft: troubleshoot AADSTS50105'
    url: 'https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/app-integration/error-code-aadsts50105-user-not-assigned-role'
  - label: 'Microsoft: assign users and groups to an application'
    url: 'https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal'
  - label: 'Microsoft: view applied Conditional Access details'
    url: 'https://learn.microsoft.com/en-us/entra/identity/monitoring-health/how-to-view-applied-conditional-access-policies'
---

## Short answer

AADSTS50105 means the enterprise application requires assignment, but the affected user has no qualifying assignment to it. Check the application's **Assignment required?** setting and intended access scope. If access should remain restricted, assign the user directly or through a group of which they are a direct member, using the required app role. Set assignment to No only when the application is meant to be available to all otherwise-authorized users in the tenant.

This is a source-documented guide, not an access issue investigated or reproduced by this site.

## Problem / symptoms

An otherwise-authenticated user reaches the application sign-in flow but Entra rejects access with an error stating that the signed-in user is not assigned to a role for the application. The assignment check can affect SAML, OpenID Connect, OAuth 2.0, WS-Federation, and Application Proxy preauthentication.

## Exact error

> AADSTS50105: The signed in user is not assigned to a role for the application.

Record the affected identity, application, timestamp, and correlation ID from the sign-in error or the matching Entra sign-in event.

## Environment and scope

Microsoft Entra enterprise applications whose service principal has **Assignment required?** set to **Yes**. This is an application-access assignment check; it is distinct from Conditional Access, app consent, or the user's application-specific permissions after sign-in.

## What the evidence establishes

Microsoft states that a user can satisfy the requirement through a direct user assignment or through an assigned group when the user is a direct member. Nested group membership should not be relied on for predictable assignment behavior. If the app exposes no named role, the documented **Default Access** role can satisfy assignment without adding a `roles` claim to the token.

## Investigation

1. In Entra ID → Monitoring & health → Sign-in logs, locate the failed event by user, app, time, and correlation ID. Confirm the failure is AADSTS50105.
2. Open Entra ID → Enterprise apps → All applications → the affected app → Properties. Check **Assignment required?** and confirm that the setting matches the access policy the owner intends.
3. Open **Users and groups** and check whether the affected user is assigned directly or is a direct member of an assigned group. Confirm that the assigned app role is correct.
4. If the user is in a nested group, verify direct membership or use a direct user assignment in line with the organization's access design.
5. Test with the affected non-administrator identity. A Global Administrator can sign in without an assignment, so that account is not a valid test of the requirement.

## Root cause

The application is configured to allow assigned users only, and the affected account has no assignment that satisfies that gate. The code does not mean the user needs a higher directory role or that the application should become available to everyone.

## Resolution

If access should remain limited, assign the intended user or direct-membership group under **Users and groups**, selecting the app role the owner expects. If the application has no named role, use **Default Access** where appropriate. Group-based application assignment requires Microsoft Entra ID P1 or P2 licensing.

If all otherwise-authorized users should be able to access the application, an administrator can set **Assignment required?** to **No**. That broadens who can obtain a token for the app; make that change only after the app owner confirms that this is the intended policy. Other controls, including Conditional Access and app-side authorization, continue to apply.

## Verification

- Retry with the affected user's account after the assignment has been saved and propagated.
- Confirm the sign-in event no longer reports AADSTS50105 and identifies the intended application.
- Verify both an assigned user and a user outside the intended access scope so the change preserves the intended boundary.

## Vendor sources

- [Troubleshoot AADSTS50105](https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/app-integration/error-code-aadsts50105-user-not-assigned-role)
- [Assign users and groups to an application](https://learn.microsoft.com/en-us/entra/identity/enterprise-apps/assign-user-or-group-access-portal)
- [View applied Conditional Access details](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/how-to-view-applied-conditional-access-policies)
