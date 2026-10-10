---
title: 'AADSTS700016: Entra app not found'
slug: aadsts700016-application-not-found
description: 'Trace AADSTS700016 to the client ID and tenant in the token request before changing app consent or registration.'
datePublished: 2026-10-07
dateModified: 2026-10-10
product: 'Microsoft Entra ID'
vendor: 'Microsoft'
versions: ['Microsoft identity platform; tenant and application configuration varies']
category: 'Identity and access'
tags: ['authentication', 'application ID', 'tenant ID', 'service principal', 'OAuth 2.0']
errorCodes: ['AADSTS700016']
eventIds: []
logFiles: ['Microsoft Entra sign-in logs']
symptoms: ['A token request names an app ID that the receiving directory cannot resolve.', 'The configured authority may target a different directory from the intended app.']
visibility: published

sources:
  - label: 'Microsoft: AADSTS700016 troubleshooting'
    url: 'https://learn.microsoft.com/en-us/entra/msidweb/getting-started/daemon-app'
  - label: 'Microsoft: authentication and authorization error codes'
    url: 'https://learn.microsoft.com/en-us/entra/identity-platform/reference-error-codes'
---

## Short answer

AADSTS700016 means the application identifier in the request was not found in the directory that received it. First verify the Application (client) ID and the tenant/authority used by the app. Then confirm the app is registered in that tenant or, for a multitenant app, that the required enterprise application/service principal exists there. Grant consent only when the requested permissions and app are expected and approved.

## Our diagnostic lens

Read the request as a tuple: **client ID + authority/tenant + application audience**. Verify those three values against the intended deployment before checking consent. If they match but the app is multitenant, determine whether its tenant-local service principal has been provisioned through the publisher's approved flow. Consent changes permissions; it cannot repair a typo or a request sent to the wrong directory.

Use the request details and application registration to narrow down which tenant or client ID is involved.

## Problem / symptoms

A user or service attempts to obtain a token, but Entra reports that it cannot find the application in the named directory. This can happen before user assignment or API permission details become relevant.

## Exact error

> AADSTS700016: the application ID could not be resolved in the target tenant.

The wording can also say the application has not been installed by an administrator or consented to, or that the request may have been sent to the wrong tenant.

## Environment and scope

Microsoft Entra app registrations and OAuth/OIDC token requests, including daemon applications using Microsoft.Identity.Web. The exact cause depends on whether the app is single-tenant, multitenant, or Microsoft-owned.

## What the evidence establishes

Microsoft documents an invalid ClientId or an app that is not registered in the specified tenant as causes. The Entra error reference also describes a missing client application in the tenant. This code by itself does not prove that admin consent is the fix.

## Investigation

1. Record the error's application ID, tenant/directory, timestamp, and correlation ID.
2. Compare the configured ClientId with Application (client) ID in the intended app registration. Do not confuse it with the object ID or service-principal ID.
3. Inspect the token authority/tenant in the app configuration and the tenant shown in the failed request. Check environment variables, deployment settings, and tenant-specific authority URLs.
4. In the intended tenant, check whether the app registration exists. For a multitenant app, check whether its enterprise application/service principal has been created in that resource tenant and whether the app supports that tenant type.
5. If the identifier belongs to a Microsoft first-party app or a third-party app, verify it from the app owner or vendor. Do not substitute an ID found in an unrelated forum post.

## Likely causes
The request's client ID does not identify an application available in the tenant named by the request. A stale or incorrect client ID and an incorrect tenant authority are common configuration paths; a missing tenant-local service principal can matter for a multitenant application.

## Suggested troubleshooting steps
Correct the client ID or tenant authority to match the intended registration. If a legitimate multitenant application has not yet been provisioned in the target tenant, follow the publisher's onboarding and tenant-consent process after reviewing the requested permissions. Consent is an authorization decision, not a generic repair step.

## How to check the result
- Retry token acquisition against the intended tenant and app ID.
- Confirm the sign-in log refers to the expected application and tenant.
- If token acquisition proceeds but returns a consent or permission error, diagnose that new code separately; do not treat it as the same failure.

## Vendor sources

- [Microsoft.Identity.Web: AADSTS700016](https://learn.microsoft.com/en-us/entra/msidweb/getting-started/daemon-app)
- [Microsoft Entra authentication and authorization error codes](https://learn.microsoft.com/en-us/entra/identity-platform/reference-error-codes)
