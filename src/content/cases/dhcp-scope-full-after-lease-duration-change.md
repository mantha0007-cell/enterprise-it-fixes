---
title: "DHCP scope still full after shortening the lease duration"
slug: "dhcp-scope-full-after-lease-duration-change"
description: "Diagnose a full Windows DHCP scope safely: inspect lease states, exclusions, reservations, and utilization before reclaiming any address."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "Windows Server DHCP"
vendor: "Microsoft"
versions: ["Windows Server 2016, 2019, 2022, and 2025"]
category: "Deployment"
tags: ["DHCP", "scope utilization", "lease duration", "address pool", "Windows Server"]
errorCodes: []
eventIds: []
logFiles: ["DHCP Server event log", "DHCP audit log"]
symptoms: ["A scope remains exhausted after its configured lease duration was reduced.", "The address pool shows leases that may belong to offline or retired clients."]
visibility: published

sources:
  - label: "Microsoft: DHCP scopes in Windows Server"
    url: "https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-scopes"
  - label: "Microsoft: Install and configure DHCP Server"
    url: "https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/quickstart-install-configure-dhcp-server"
  - label: "Microsoft: Remove-DhcpServerv4Lease cmdlet"
    url: "https://learn.microsoft.com/en-us/powershell/module/dhcpserver/remove-dhcpserverv4lease?view=windowsserver2025-ps"
---

## Short answer

Reducing a scope's configured lease duration does not instantly make addresses available. Check the actual lease expiration times and address-pool accounting first. A ping failure is not enough evidence that a lease is unused, and deleting a lease can make an address reusable while its client is still active.

## Our diagnostic lens

Separate **configured lease policy** from **leases already assigned** and from **addresses excluded or reserved**. The useful question is not simply “is the scope full?” but “which addresses are unavailable, why are they unavailable, and when will each lease expire?”

## Investigation

1. **Confirm the correct scope and subnet.** Compare the scope range and mask with the clients' network and relay configuration. Check for another overlapping scope or DHCP server before changing the pool.
2. **Review scope utilization and lease states.** In the DHCP console, inspect address leases and statistics. Record lease state, client identifier, expiration, and whether the entry is marked bad or declined. Do not publish client identifiers or addresses from a production environment.
3. **Check exclusions and reservations.** Excluded ranges and reservations reduce the number of addresses available for general dynamic assignment. Compare them with the intended design and any recent changes.
4. **Check client population and churn.** Look for guest devices, wireless clients, virtual machines, lab devices, or devices that move between network segments. Correlate DHCP audit records with the period of high utilization.
5. **Wait for the leases to renew or expire.** A new lease duration affects DHCP lease offers going forward; clients with a current lease may still hold an address until renewal or expiration. Confirm the expiration shown for each lease rather than assuming the scope setting has reclaimed it.
6. **Assess capacity.** If active clients legitimately need more addresses, coordinate a subnet or pool expansion and verify routing, relay, exclusions, reservations, and adjacent scopes before implementation.

## Reclaiming addresses safely

Do not mass-delete leases based on failed ping tests. Sleeping laptops, firewalled endpoints, and temporarily disconnected equipment can still have valid leases. Microsoft documents that `Remove-DhcpServerv4Lease` deletes lease records; deleting every lease in a scope can disrupt clients and should never be used as routine cleanup.

If an individual lease is confirmed obsolete under your change process, record its scope and client identifier, verify the device is retired or has released the address, and remove only that specific lease. Recheck the pool and monitor for address conflicts afterward.

## How to check the result

- Confirm the scope has free addresses and its utilization is trending as expected.
- Watch for duplicate-IP reports or clients that fail to renew after a targeted cleanup.
- Verify new clients receive the expected subnet options and lease duration.
- If utilization remains high, plan capacity or correct scope overlap instead of repeatedly deleting uncertain leases.

## Sources

- [DHCP scopes in Windows Server](https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/dhcp-scopes)
- [Install and configure DHCP Server](https://learn.microsoft.com/en-us/windows-server/networking/technologies/dhcp/quickstart-install-configure-dhcp-server)
- [Remove-DhcpServerv4Lease cmdlet](https://learn.microsoft.com/en-us/powershell/module/dhcpserver/remove-dhcpserverv4lease?view=windowsserver2025-ps)
