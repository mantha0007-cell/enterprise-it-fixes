---
title: "ConfigMgr PXE fails across subnets"
slug: "configmgr-pxe-remote-subnet-ip-helper"
description: "Troubleshoot Configuration Manager PXE clients on a remote VLAN with packet forwarding, DHCP, distribution point, and SMSPXE.log checks."
datePublished: 2026-10-07
dateModified: 2026-10-10
product: "Microsoft Configuration Manager"
vendor: "Microsoft"
versions: ["Microsoft Configuration Manager current branch"]
category: "Deployment"
tags: ["configuration-manager", "pxe", "ip-helper", "network"]
errorCodes: []
eventIds: []
logFiles: ["SMSPXE.log", "DHCP server logs"]
symptoms: ["A client on a routed VLAN fails before reaching the Configuration Manager boot workflow.", "Same-site clients start PXE while remote-subnet clients do not."]
visibility: published

sources:
  - label: "Microsoft: Troubleshoot PXE boot issues in Configuration Manager"
    url: "https://learn.microsoft.com/en-us/troubleshoot/mem/configmgr/os-deployment/troubleshoot-pxe-boot-issues"
---
## Short answer

PXE discovery relies on network traffic that does not cross routers as a normal broadcast. For clients on a different subnet, configure and validate router IP helpers to forward the required traffic to the DHCP service and PXE-enabled Configuration Manager distribution point. Compare a same-subnet client with a remote-subnet client before changing boot images or task sequences.

## Our diagnostic lens

Break the boot attempt into checkpoints: **address lease → PXE request reaches the intended distribution point → server selects a boot image → client downloads and starts it**. Compare one working and one failing subnet at the same checkpoint. If the client never appears in `SMSPXE.log`, stay with relay/routing and endpoint reachability. If the request is logged, move to Configuration Manager site, boundary, and boot-image checks. This assigns the next investigation to the layer that first diverges.

## Symptoms

- PXE works on the distribution point’s local VLAN but fails on another routed VLAN.
- The client does not receive a PXE response or never reaches the Configuration Manager boot menu.
- `SMSPXE.log` shows no request from the remote client, or the request reaches the server but does not produce an expected response.

## Error and log evidence

There is no single error code for this topology issue. Start with the client’s on-screen PXE message, DHCP lease evidence, packet capture if available, and `SMSPXE.log` on the intended PXE-enabled distribution point.

## Environment

Microsoft Configuration Manager current branch, PXE-enabled distribution point, DHCP service, and one or more routed client subnets. This guide is about network discovery and forwarding; it does not diagnose every PXE boot failure.

## Evidence to collect

1. Test one client on the distribution point’s subnet and one on the failing subnet with the same model and boot image.
2. Confirm DHCP address assignment on the failing subnet.
3. Inspect the router or layer-3 switch configuration for IP helpers to the required DHCP and PXE endpoints.
4. Check whether the PXE-enabled distribution point receives the remote client request in `SMSPXE.log`.
5. If possible, capture DHCP/PXE traffic on both sides of the routed boundary and verify the helper forwards it to the intended servers.
6. Confirm the target distribution point is PXE-enabled and its boot images are distributed.

## Likely causes
The first missing checkpoint is often a relay path that does not reach every service required by the design. A working lease by itself does not prove that PXE discovery reaches the distribution point. DHCP options 60, 66, and 67 are not a general replacement for IP helpers in this Configuration Manager topology; verify the specific DHCP/WDS arrangement against Microsoft's current guidance.

## Suggested troubleshooting steps
Coordinate with the network owner to configure the router’s IP helper addresses for the DHCP service and PXE-enabled distribution point required by the design. Avoid blanket changes to DHCP options 66/67; incorrect boot server or filename values can break clients and may not support the Configuration Manager scenario.

Recheck the PXE-enabled distribution point, boundary groups, boot image distribution, and network ACLs only after proving the request reaches the expected endpoint.

## How to check the result
Repeat the controlled test from the remote VLAN. Verify DHCP assignment, PXE request arrival in `SMSPXE.log`, boot image selection, and progression to the task-sequence wizard. Test another representative subnet before broad deployment.

## Version notes

The networking principle applies across Configuration Manager current branch releases, but supported PXE architecture and console settings can change. Check Microsoft’s current troubleshooting article.

## Sources

- [Microsoft: Troubleshoot PXE boot issues in Configuration Manager](https://learn.microsoft.com/en-us/troubleshoot/mem/configmgr/os-deployment/troubleshoot-pxe-boot-issues)
