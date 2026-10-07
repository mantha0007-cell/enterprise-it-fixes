---
title: 'AADSTS50011: troubleshoot a Microsoft Entra redirect URI mismatch'
slug: aadsts50011-redirect-uri-mismatch
description: 'Compare the redirect_uri in the failed sign-in request with the app registration, then correct the side that is wrong.'
datePublished: 2026-10-07
dateModified: 2026-10-07
product: 'Microsoft Entra ID'
vendor: 'Microsoft'
versions: ['Microsoft identity platform; OIDC and OAuth 2.0 applications']
category: 'Identity and access'
tags: ['authentication', 'app registration', 'OAuth 2.0', 'OpenID Connect', 'SSO']
errorCodes: ['AADSTS50011']
eventIds: []
logFiles: ['Microsoft Entra sign-in logs']
symptoms: ['Sign-in stops while Microsoft Entra checks the application return address.']
visibility: published

sources:
  - label: 'Microsoft: AADSTS50011 troubleshooting'
    url: 'https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/app-integration/error-code-AADSTS50011-redirect-uri-mismatch'
  - label: 'Microsoft: add a redirect URI to an application'
    url: 'https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri'
  - label: 'Microsoft: redirect URI restrictions and best practices'
    url: 'https://learn.microsoft.com/en-us/entra/identity-platform/reply-url'
---

## Short answer

AADSTS50011 means the application sent a redirect_uri that Microsoft Entra ID cannot match to a URI registered for that app. Compare the URI in the failed authorization request with App registrations → your app → Authentication. Correct the application configuration if it sent the wrong callback; otherwise add the intended URI under the correct platform type. Do not add a URI you do not control.


## Our diagnostic lens

Treat the failure as a three-value comparison rather than an instruction to add another URI:

| Value to compare | Where it comes from | What a difference suggests |
| --- | --- | --- |
| Callback generated at runtime | Failed authorization request | The app, proxy, or deployment setting may be producing the wrong address. |
| Callback expected by the application | App configuration and public URL | A stale base URL, scheme, port, or path may be involved. |
| Callback registered with Entra | App registration and platform type | The intended callback may be missing from the matching registration. |

Find the first pair that differs. Change the component that owns that value; adding every observed URL to the registration can make an unintended endpoint trusted.

## Problem / symptoms

Users reach Microsoft Entra sign-in and then get rejected before returning to the application. The error commonly includes the requested URI and an application ID.

## Exact error

> AADSTS50011: redirect URI mismatch.

The full message may include the URI and app ID. Treat tenant-specific values as sensitive when sharing logs.

## Environment and scope

Microsoft Entra app registrations used by OIDC or OAuth 2.0 sign-in flows. A SAML app also has a reply-URL concept, but use the vendor's SAML instructions if the failing request is SAML rather than an OIDC/OAuth authorization request.

## What the evidence establishes

Entra compares the callback URI sent by the application with the redirect URIs registered for that app. A mismatch produces this code. A redirect URI is a security boundary: Entra only sends authorization responses to registered destinations.

## Investigation

1. Capture the failed sign-in's timestamp, correlation ID, application ID, and requested redirect_uri from the error or sign-in details.
2. Open the matching app registration by Application (client) ID. Check Authentication and the platform configuration used by this app (Web, Single-page application, or mobile/desktop).
3. Compare the full URI, including scheme, host, port, path, and trailing slash where applicable. Check production and local-development callbacks separately.
4. If the URI in the request is unexpected, inspect the app's base URL, proxy headers, callback setting, and environment-specific configuration. Do not “fix” an incorrect callback by registering it blindly.

## Likely causes
The callback configured in the application and the callback allow-list in its Entra registration do not agree. Common sources of drift include a changed hostname, reverse-proxy scheme, port, path, or deployment environment. The exact difference must be read from the failing request; the error code alone does not say which side is wrong.

## Suggested troubleshooting steps
Update the application to send its intended callback, or add that exact intended callback to the matching app registration under the right platform. Save the registration and allow several minutes for the change to take effect before retesting.

Avoid wildcard callbacks and do not expose development callbacks in a production registration without a reason. Microsoft recommends exact, controlled URIs because authorization responses can contain security tokens.

## How to check the result
- Retry the same sign-in flow after the configuration has propagated.
- Confirm the request now contains the expected callback and Entra returns the response to the intended application endpoint.
- Check the new sign-in event; preserve the correlation ID if the failure remains.
- Confirm that a production login did not start using a development or untrusted callback.

## Vendor sources

- [AADSTS50011 troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/entra/entra-id/app-integration/error-code-AADSTS50011-redirect-uri-mismatch)
- [Add a redirect URI to your application](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri)
- [Redirect URI restrictions and best practices](https://learn.microsoft.com/en-us/entra/identity-platform/reply-url)
