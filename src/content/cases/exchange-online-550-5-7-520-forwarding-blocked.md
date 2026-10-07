---
title: "Exchange Online 550 5.7.520: automatic external forwarding is blocked"
slug: "exchange-online-550-5-7-520-forwarding-blocked"
description: "Diagnose Exchange Online NDR 550 5.7.520 when automatic forwarding to an external recipient is blocked by outbound spam policy."
datePublished: 2026-10-07
dateModified: 2026-10-07
product: "Exchange Online"
vendor: "Microsoft"
versions: ["Exchange Online"]
category: "Email"
tags: ["exchange-online", "mail-flow", "forwarding", "ndr"]
errorCodes: ["550 5.7.520"]
eventIds: []
logFiles: ["Non-delivery report (NDR)", "Message trace"]
symptoms: ["An automatic forward to an external recipient returns 550 5.7.520.", "Message trace shows rejection during outbound forwarding rather than initial delivery."]
visibility: published

sources:
  - label: "Microsoft: outbound spam policies and external email forwarding"
    url: "https://learn.microsoft.com/en-us/defender-office-365/outbound-spam-policies-external-email-forwarding"
---
## Short answer

This NDR identifies an outbound-spam-policy restriction on automatic external forwarding. Confirm that the message was automatically forwarded and inspect the effective outbound spam policy before changing configuration. Do not enable external forwarding tenant-wide as a quick fix.

## Our diagnostic lens

Start from the mail-flow path, not the policy toggle: **original delivery → forwarding mechanism → outbound policy evaluation → external handoff**. Message trace should show where the path stopped. Then identify whether the mailbox rule, mailbox setting, or transport rule initiated forwarding and which outbound policy applies to that sender. If forwarding was never intended, treat the rule as a possible security issue; if it was approved, scope any exception to the business need and destination.

## Symptoms

- Automatic forwarding to an external mailbox fails.
- The non-delivery report contains `550 5.7.520`.
- The original sender may be internal or external; the relevant control is the organization’s outbound forwarding policy.

## Exact error

`550 5.7.520` indicates that the organization's policy blocked automatic external forwarding. The exact NDR wording can vary.

Use the full diagnostic text and message trace to confirm the failure path.

## Environment and scope

This guide covers automatic external forwarding in Exchange Online. It does not establish that every NDR with a 5.7.x status has the same cause. User-created inbox rules, mailbox forwarding settings, transport rules, remote-domain configuration, and security controls can all affect mail flow.

## Evidence to collect

1. Preserve the complete NDR, including diagnostic code, timestamp, sender, and recipient. Redact addresses before sharing.
2. Use Exchange Online message trace to establish whether a message was delivered to the mailbox and then blocked when forwarding.
3. Identify the forwarding method: inbox rule, mailbox forwarding property, or mail-flow rule.
4. In the Microsoft Defender portal, inspect the outbound spam policy that applies to the sender or mailbox and its automatic-forwarding setting.
5. Review relevant remote-domain and mail-flow rules for an additional restriction.

## Likely causes
The effective outbound spam policy disallows automatic forwarding to external recipients. The error code is a useful policy clue, but the NDR alone does not prove which configuration object or rule applies in a particular tenant.

## Suggested troubleshooting steps
If the forwarding is expected and approved, use the narrowest supported policy scope and an explicitly authorized destination. Document the business owner and review date. Keep the default broad restriction for other mailboxes.

If the forwarding was unexpected, disable the rule or forwarding setting, investigate mailbox sign-ins and audit events, and follow the organization’s account-compromise response process before restoring access.

Do not create a broad allow rule or enable external forwarding across the tenant merely to clear the NDR.

## How to check the result
After an authorized, scoped change, send a new test message and inspect its message trace and destination receipt. Confirm an unrelated mailbox remains subject to the intended restriction. Revert the exception if it does not meet the documented need.

## Version notes

The cited guidance applies to Exchange Online policy behavior. Microsoft may change portal labels and policy defaults; check the linked documentation and the tenant’s effective policy at the time of diagnosis.

## Sources

- [Microsoft: Configure outbound spam policies for external email forwarding](https://learn.microsoft.com/en-us/defender-office-365/outbound-spam-policies-external-email-forwarding)
