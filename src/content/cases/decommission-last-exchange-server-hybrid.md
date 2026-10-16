---
title: "Retiring the last on-premises Exchange server in a hybrid environment"
slug: "decommission-last-exchange-server-hybrid"
description: "Use a dependency-led checklist to assess SMTP relay, hybrid recipient management, mail flow, and the supported end state before retiring the final Exchange server."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "Exchange Server and Exchange Online"
vendor: "Microsoft"
versions: ["Hybrid Exchange deployments; confirm current version requirements in Microsoft documentation"]
category: "Email"
tags: ["exchange-server", "exchange-online", "hybrid", "decommissioning", "smtp-relay", "recipient-management"]
errorCodes: []
eventIds: []
logFiles: ["Exchange message tracking logs", "SMTP protocol logs", "Firewall and application mail logs"]
symptoms: ["All or most mailboxes are in Exchange Online, but an on-premises Exchange server remains", "The purpose of the final Exchange server is unclear", "Teams are considering shutting down or uninstalling the last hybrid Exchange server"]
visibility: published
sources:
  - label: "Microsoft: How and when to decommission on-premises Exchange servers in a hybrid deployment"
    url: "https://learn.microsoft.com/en-us/exchange/decommission-on-premises-exchange"
  - label: "Microsoft: Decommission the last Exchange Server after transferring SOA to cloud"
    url: "https://learn.microsoft.com/en-us/exchange/hybrid-deployment/decommission-last-exchange-server"
  - label: "Microsoft: Manage hybrid Exchange recipients with Management Tools"
    url: "https://learn.microsoft.com/en-us/exchange/manage-hybrid-exchange-recipients-with-management-tools"
  - label: "Microsoft Lifecycle: Exchange Server 2016"
    url: "https://learn.microsoft.com/en-us/lifecycle/products/exchange-server-2016"
---

## Short answer

Do not decide that the final on-premises Exchange server is disposable just because user mailboxes are in Exchange Online. First identify every workload that still depends on it, especially SMTP relay, journaling, hybrid features, and management of directory-synchronized recipients. Then choose one supported end state and follow the Microsoft procedure for that scenario. A shutdown test, an Exchange uninstall, and Active Directory cleanup are different actions with different consequences.

## Start with the server's remaining jobs

Build a dependency list before scheduling a shutdown. Treat each item as a separate mail-flow or management path, and ask its owner to confirm the replacement and test evidence.

| Dependency area | What to establish | Evidence to keep |
|---|---|---|
| Local recipients and databases | Whether any user, archive, public-folder, arbitration, audit, or other system mailbox still requires handling | Recipient inventory with an owner and an approved disposition for each remaining object |
| SMTP relay | Which applications, devices, and services submit mail through the server, and what will receive it after the change | Connector and protocol-log review, source-system owner confirmation, and successful replacement-path tests |
| Outbound mail and journaling | Whether transport connectors, compliance journaling, or a mail-security service still route through the server | End-to-end tests and confirmation from the service owner |
| Hybrid functions | Whether migration endpoints, organization relationships, free/busy, OAuth, centralized transport, or other coexistence settings remain in use | Configuration review and a documented decision for each function |
| Recipient management | Where Exchange attributes are authoritative and how synchronized recipients will be managed afterward | A tested cloud-management or Management Tools plan that matches the environment |
| Network and discovery | Whether DNS, Autodiscover, firewall, NAT, load balancers, scripts, or scheduled tasks reference the server | Configuration inventory and validation from the responsible owners |

This list is a starting point, not proof that a dependency exists. Conversely, an empty or quiet log window does not prove that a service is unused: retention, log coverage, intermittent jobs, and missing sources can hide activity.

## Use evidence to decide whether a dependency is active

For SMTP relay, combine connector configuration with protocol logs and the systems that can send to the server. Review a representative period that covers scheduled and infrequent jobs. Map source addresses to applications or devices, then have each owner test the proposed replacement route. A configured connector shows capability, not recent use; a short log sample shows observed activity, not necessarily all use.

For mail flow, trace a test message through each required path, including outbound delivery, journaling, and any third-party mail security service. Check queues immediately before a change window and confirm receipt at the destination. Preserve rollback details and monitoring ownership for the cutover.

For hybrid management, identify whether Exchange recipient attributes remain synchronized from on-premises Active Directory. Decide how those attributes will be managed after the server stops running. Do not infer that moving mailboxes to the cloud automatically changes the source of authority for every recipient attribute.

## Choose one supported end state

Microsoft documents distinct approaches. Select the one that matches how the organization will manage Exchange recipients; do not combine isolated steps from both procedures.

### Cloud-based management of Exchange attributes

Where the prerequisites are met, transfer the relevant source of authority to the cloud and use Microsoft's procedure for removing the last Exchange server after that transfer. Validate the required mailbox, public-folder, DNS, mail-flow, and hybrid prerequisites immediately before removal. Follow the current Microsoft sequence for the tenant rather than treating this article as a command-by-command runbook.

### Exchange Management Tools without a running Exchange server

Some organizations retain directory synchronization and manage recipients with the supported Exchange Management Tools approach. This path has specific prerequisites and Active Directory cleanup steps. Microsoft warns against uninstalling the last Exchange server in this scenario because uninstall can remove information needed by the management tools. Use the current Management Tools guidance and its explicit shutdown and cleanup process.

The right choice depends on recipient authority, directory synchronization, remaining hybrid features, and operational requirements. If those are unclear, pause the decommission plan and resolve the architecture decision first.

## Controlled cutover checklist

1. Assign an owner to every dependency area and record a go/no-go decision.
2. Confirm all local mailbox and public-folder requirements are resolved using the procedure appropriate to each recipient type.
3. Replace and test every relay, outbound, and journaling path. Include infrequent jobs and devices, not just interactive applications.
4. Confirm the chosen recipient-management model works, including routine create and update operations where applicable.
5. Review hybrid configuration, DNS, Autodiscover, firewall/NAT, scripts, and scheduled tasks for remaining references.
6. Before the change, inspect mail queues and recent traces; during the change, monitor delivery and application alerts; afterward, verify inbound, outbound, relay, and compliance flows.
7. Keep a tested rollback plan, named decision-makers, and an observation period appropriate to the business's mail patterns.
8. Complete only the final removal or cleanup procedure that Microsoft documents for the selected end state.

Do not perform irreversible directory cleanup as an exploratory test. Record the exact procedure, its prerequisites, and the recovery implications in the approved change plan.

## Common traps

- **“All user mailboxes are online, so the server is unused.”** Relay, journaling, hybrid functions, and system mailboxes can remain.
- **“No messages appeared in the logs, so nothing uses it.”** Logs may not cover the relevant sources or a long enough period.
- **“A shutdown test is the same as uninstalling.”** It is not. The Management Tools-only path has a specific warning against uninstalling the last server.
- **“The cloud-managed and Management Tools procedures can be mixed.”** They represent different recipient-management designs; choose and validate one.
- **“Low traffic means a safe change.”** A low-volume compliance or batch process may be business-critical even if it runs rarely.

## Version and support notes

Exchange Server 2016 and Exchange Server 2019 reached end of support on October 14, 2025. Check Microsoft's current lifecycle and hybrid guidance before planning work on older servers. Support status does not establish that a specific server is safe to shut down, nor does it replace a dependency review.

## Sources

- [How and when to decommission on-premises Exchange servers in a hybrid deployment](https://learn.microsoft.com/en-us/exchange/decommission-on-premises-exchange)
- [Decommission the last Exchange Server after transferring SOA to cloud](https://learn.microsoft.com/en-us/exchange/hybrid-deployment/decommission-last-exchange-server)
- [Manage hybrid Exchange recipients with Management Tools](https://learn.microsoft.com/en-us/exchange/manage-hybrid-exchange-recipients-with-management-tools)
- [Exchange Server 2016 lifecycle](https://learn.microsoft.com/en-us/lifecycle/products/exchange-server-2016)

This guide is general planning guidance. Validate prerequisites against the current Microsoft documentation, your own hybrid design, and your organization's change-control process before acting.
