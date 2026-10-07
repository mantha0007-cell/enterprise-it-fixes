---
title: 'AADSTS53003: find which Conditional Access policy blocked sign-in'
slug: aadsts53003-blocked-by-conditional-access
description: 'AADSTS53003 means Conditional Access blocked the request; use the matching sign-in event to identify the policy and unmet condition before changing access.'
datePublished: 2026-10-07
dateModified: 2026-10-07
product: 'Microsoft Entra ID'
vendor: 'Microsoft'
versions: ['Microsoft Entra Conditional Access; policy results depend on tenant configuration and sign-in context']
category: 'Identity and access'
tags: ['Conditional Access', 'authentication', 'device compliance', 'sign-in logs', 'policy troubleshooting']
errorCodes: ['AADSTS53003', '53003']
eventIds: []
logFiles: ['Microsoft Entra sign-in logs', 'Microsoft Entra audit logs']
symptoms: ['The sign-in event records a Conditional Access denial.', 'A user reaches authentication but is refused access to a protected resource.']
visibility: published

sources:
  - label: 'Microsoft: troubleshoot Conditional Access sign-in problems'
    url: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/troubleshoot-conditional-access'
  - label: 'Microsoft: troubleshoot Entra sign-in errors'
    url: 'https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors'
  - label: 'Microsoft: use the Conditional Access What If tool'
    url: 'https://learn.microsoft.com/en-us/entra/identity/conditional-access/what-if-tool'
  - label: 'Microsoft: view applied Conditional Access details'
    url: 'https://learn.microsoft.com/en-us/entra/identity/monitoring-health/how-to-view-applied-conditional-access-policies'
---

## Short answer

AADSTS53003 means Microsoft Entra Conditional Access blocked the sign-in request. The code does not identify which policy or condition caused the block. Find the matching failed sign-in event and open its **Conditional Access** tab to see the policy results; inspect device, client app, location, user, resource, and authentication details to understand the failed condition. Correct the condition or assignment only if the policy result conflicts with the organization's intended access rule. Do not disable Conditional Access as a generic fix.

## Our diagnostic lens

Follow the event, not the name of the app the user remembers clicking. One sign-in flow can request a dependent resource, and the evaluated resource may be the one denied. In the matching event, record the resource, the policy result, and the unmet grant or condition before considering a change. Use **What If** to explore a policy scenario, then compare that simulation with the actual event; a simulation does not replace the sign-in record.


## Problem / symptoms

A user is authenticated or reaches a Microsoft sign-in page, but access to the target app or resource is denied. The error page or sign-in record can show AADSTS53003 / 53003 and “BlockedByConditionalAccess.” The browser's **More details** information may include a request ID or correlation ID useful for finding the event.

## Exact error

> AADSTS53003: Conditional Access denied this sign-in request.

The error identifies the policy family, not the individual policy or failed requirement. Do not infer from this code alone that the device is noncompliant, the user is outside a trusted location, or MFA is missing.

## Environment and scope

Microsoft Entra sign-ins to cloud applications and resources protected by Conditional Access. A single user action can request more than one resource; a dependency resource may be blocked even when the user thinks they are signing in to a different application.

## What the evidence establishes

Microsoft maps 53003 to a Conditional Access block. The sign-in event's Conditional Access tab reports the policy or policies that interrupted that request and why. The event's device, location, client, authentication, resource, and additional details provide context for evaluating the policy result.

## Investigation

1. Capture the affected user, target application, approximate time, browser or client type, request/correlation ID, and the full error details.
2. Open Entra ID → Monitoring & health → Sign-in logs. Filter to failed sign-ins for the user and time; include the target resource and correlation ID when available.
3. Open the matching event and inspect **Conditional Access**. Identify each policy's result, then review **Basic info**, **Device info**, **Location**, **Authentication details**, **Additional details**, and **Troubleshooting and support** as relevant.
4. Compare the evaluated facts with the policy's assignments and conditions. Check the requested resource as well as the application, because a dependent resource can be the blocked request.
5. If the event does not make the policy outcome clear, run the sign-in diagnostic or use the Conditional Access **What If** tool with the same user, app/resource, and sign-in conditions. What If is a simulation; confirm the result against the actual event.
6. If the user is fully locked out, involve another authorized administrator or Microsoft support rather than attempting blind policy changes.

## Likely causes
One or more Conditional Access policies evaluated the sign-in and denied access because its assignments, conditions, or grant controls did not produce an allowed outcome. The exact policy and signal are specific to the event; the code alone is insufficient to name the cause.

## Suggested troubleshooting steps
If the block is expected, have the user meet the requirement through an approved account, device, client, location, or authentication method. If the result is unintended, adjust only the specific policy assignment, condition, or grant control that the event shows is wrong, and preserve the organization's security objective. Test the changed rule in a controlled scope or report-only mode when appropriate before broad enforcement. Check service dependencies when a different resource than expected is blocked.

Do not broadly exclude the user or app, set assignment or policy controls to allow everyone, or turn off MFA to make one sign-in succeed without approval from the policy owner.

## How to check the result
- Repeat the same user and resource sign-in under the relevant conditions.
- Confirm the new event shows the intended Conditional Access policy outcome and expected resource.
- Test an in-scope and out-of-scope account or device to confirm the policy still protects the intended population.
- Check for a new error code separately; a later authentication or authorization failure is a different investigation.

## Vendor sources

- [Troubleshoot sign-in problems with Conditional Access](https://learn.microsoft.com/en-us/entra/identity/conditional-access/troubleshoot-conditional-access)
- [Troubleshoot Microsoft Entra sign-in errors](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-troubleshoot-sign-in-errors)
- [Use the Conditional Access What If tool](https://learn.microsoft.com/en-us/entra/identity/conditional-access/what-if-tool)
- [View applied Conditional Access details](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/how-to-view-applied-conditional-access-policies)
