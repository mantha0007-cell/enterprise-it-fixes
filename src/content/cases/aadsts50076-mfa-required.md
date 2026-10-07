---
title: 'AADSTS50076: diagnose the Microsoft Entra MFA requirement'
slug: aadsts50076-mfa-required
description: 'AADSTS50076 usually signals a required MFA step after a policy, account, or sign-in-context change; inspect the sign-in event.'
datePublished: 2026-10-07
dateModified: 2026-10-07
product: 'Microsoft Entra ID'
vendor: 'Microsoft'
versions: ['Microsoft identity platform; policy behavior depends on tenant configuration']
category: 'Identity and access'
tags: ['MFA', 'Conditional Access', 'sign-in logs', 'authentication']
errorCodes: ['AADSTS50076']
eventIds: []
logFiles: ['Microsoft Entra sign-in logs']
symptoms: ['The user must use multifactor authentication to access the resource.']
visibility: published

sources:
  - label: 'Microsoft: AADSTS50076 error code'
    url: 'https://learn.microsoft.com/en-us/entra/identity-platform/reference-error-codes'
  - label: 'Microsoft: troubleshoot Entra sign-in errors'
    url: 'https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors'
  - label: 'Microsoft: view applied Conditional Access details'
    url: 'https://learn.microsoft.com/en-us/entra/identity/monitoring-health/how-to-view-applied-conditional-access-policies'
---

## Short answer

AADSTS50076 means this sign-in needs an MFA claim that the current session did not satisfy. Have the user complete the expected interactive MFA challenge and retry. If this is unexpected or repeats, inspect the matching Microsoft Entra sign-in event and its Conditional Access and Authentication Details tabs to see which policy or context triggered MFA. Do not disable MFA as a first response.

Use the sign-in event and policy details to determine which requirement applies in the affected tenant.

## Problem / symptoms

A token request or application sign-in is interrupted with an MFA requirement. The event may follow an administrator policy change, a changed sign-in location, or a tenant's per-user or Conditional Access configuration.

## Exact error

> AADSTS50076: an additional multifactor authentication step is required.

## Environment and scope

Microsoft Entra interactive and non-interactive sign-ins. The MFA requirement may come from Conditional Access, per-user MFA, Security Defaults, or another authentication policy. A Teams Rooms resource account has additional product-specific constraints; follow the Teams Rooms documentation for that device scenario.

## What the evidence establishes

Microsoft defines this code as a request to use MFA, often after a configuration or location change. The code does not mean that MFA itself is broken, and it does not identify a particular policy without the sign-in record.

## Investigation

1. Capture the sign-in time, user, application/resource, correlation ID, error code, and failure reason.
2. In Entra ID → Monitoring & health → Sign-in logs, filter to the user, app, time, and failed status. Open the matching event.
3. Review Conditional Access to identify policies that applied, and Authentication Details to see the authentication sequence and result.
4. Use Troubleshoot Event or sign-in diagnostics if the policy result is unclear. Confirm whether the user completed the challenge and whether the current session was interactive.
5. If the account is a service or room resource account, verify that the resource-account design is supported before changing its MFA or Conditional Access requirements.

## Likely causes
The request arrives without the required MFA claim for the current access policy and context. The cause can be a legitimate step-up challenge or a policy/resource-account mismatch. Only the sign-in record and tenant policy show which applies.

## Suggested troubleshooting steps
For a normal user sign-in, complete MFA and retry with a fresh sign-in request. For a repeated or unexpected interruption, correct the specific assignment, authentication method, device condition, or resource-account design identified in the logs. Keep the intended security requirement in place; adjust policy only after an administrator confirms the desired access rule.

## How to check the result
- Confirm the next sign-in succeeds after the required MFA step.
- Confirm the log records the expected authentication method and policy outcome.
- If a policy change was required, test both an in-scope and out-of-scope account/device to ensure the rule still protects the intended population.

## Vendor sources

- [Microsoft Entra authentication and authorization error codes](https://learn.microsoft.com/en-us/entra/identity-platform/reference-error-codes)
- [Troubleshoot Microsoft Entra sign-in errors](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors)
- [View applied Conditional Access details](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/how-to-view-applied-conditional-access-policies)
