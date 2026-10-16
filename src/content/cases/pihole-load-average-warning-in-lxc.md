---
title: "Pi-hole load average warning in an LXC container"
slug: "pihole-load-average-warning-lxc"
description: "Interpret Pi-hole's 15-minute load warning in a Proxmox LXC container and check CPU visibility, CPU limits, I/O waits, and service health before resizing."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "Pi-hole FTL on Proxmox VE LXC"
vendor: "Pi-hole; Proxmox"
versions: ["Pi-hole FTL and Proxmox VE; exact versions vary"]
category: "Networking"
tags: ["Pi-hole", "Proxmox VE", "LXC", "Linux", "load average", "DNS"]
errorCodes: []
eventIds: []
logFiles: ["Pi-hole FTL diagnosis"]
symptoms: ["Pi-hole reports that the 15-minute system load average exceeds the number of available cores.", "DNS service appears active but FTL reports an excessive-load diagnosis."]
visibility: published

sources:
  - label: "Pi-hole: Configuration — load check"
    url: "https://docs.pi-hole.net/ftldns/configfile/"
  - label: "Proxmox VE: pct command reference"
    url: "https://pve.proxmox.com/pve-docs/pct.1.html"
  - label: "Linux man-pages: proc_loadavg"
    url: "https://man7.org/linux/man-pages/man5/proc_loadavg.5.html"
---

## Short answer

Pi-hole FTL reports this diagnosis when the 15-minute system load average is greater than the number of CPU cores it sees. Treat it as a signal to inspect sustained scheduling or I/O pressure, not as proof that the DNS service is down or that a fixed number of cores is required. In an LXC container, check both the CPUs presented to the container and any CPU-time limit before changing its allocation.

## Our diagnostic lens

The comparison in the warning is between a load average and a visible core count. Linux load average includes tasks ready to run and tasks waiting for certain I/O; it is not the same as a CPU-utilization percentage. A single snapshot therefore cannot tell whether the cause is CPU contention, I/O waits, or an undersized container allocation. Compare the trend, the host and guest views, and whether DNS is actually slow.

## Symptoms

- Pi-hole Diagnosis reports that the 15-minute load average is above the number of processors.
- The FTL service may still be running, so the warning needs to be checked against real DNS behavior.
- The issue may appear after changing container resources or during a period of increased host activity.

## Investigation

1. **Record the warning and time.** Note the load value, the core count used in the comparison, the Pi-hole version, and whether the message is recurring or historical.
2. **Check the 1-, 5-, and 15-minute averages.** A falling value after a short spike suggests a different pattern from a 15-minute average that remains elevated. Linux exposes these averages through `uptime` and `/proc/loadavg`.
3. **Check CPU visibility and limits in Proxmox.** Review the container's `cores`, `cpulimit`, and CPU weight settings. `cores` controls the CPUs visible to the container; `cpulimit` can separately restrict CPU time. Compare the configuration with the count reported inside the container, for example with `nproc`.
4. **Look for I/O waits and host contention.** If load is high while guest CPU use does not appear saturated, inspect blocked tasks, storage latency, and activity on the Proxmox host. Load average can include tasks waiting for I/O.
5. **Check the service separately.** Confirm that Pi-hole FTL and any configured upstream resolver are active. Test a DNS lookup through Pi-hole and compare its response time with a direct check of the upstream. A load warning alone does not establish a DNS outage.

## Likely causes

- The container sees fewer cores than the workload needs during sustained peaks.
- A configured CPU-time limit restricts the container even though multiple cores are visible.
- Processes are waiting on storage or another I/O resource, increasing load without a matching rise in CPU percentage.
- Other workloads on the host compete for CPU or storage capacity.
- A temporary spike has not yet aged out of the 15-minute average.

## Suggested response

Use the evidence to choose a small, reversible adjustment. If CPU saturation is sustained and DNS latency coincides with it, consider adding a visible core or relaxing an overly restrictive CPU-time limit, subject to host capacity and local change controls. If the evidence points to I/O waits or host contention, address that bottleneck instead of adding cores blindly.

After a resource change, verify the CPU count inside the container, observe the load trend long enough for the 15-minute average to respond, and test DNS from a client. Do not disable the Pi-hole load check merely to clear the notice; that hides a useful diagnostic signal.

## How to check the result

- Confirm the container sees the intended CPU count and has the expected CPU limits.
- Check that the 15-minute average trends below the visible core count during normal workload.
- Make a DNS lookup through Pi-hole and confirm the relevant resolver services remain healthy.
- If the warning returns, compare the new time and load pattern with host CPU, storage, and service logs.

## Version and configuration note

Pi-hole documents this warning threshold as the 15-minute load average exceeding the core count. Proxmox exposes separate settings for visible cores and CPU-time limiting. A configuration that looks like “two cores” can still have a tighter CPU-time cap, so record both values before drawing a conclusion.

## Vendor sources

- [Pi-hole configuration: load check](https://docs.pi-hole.net/ftldns/configfile/)
- [Proxmox VE `pct` reference](https://pve.proxmox.com/pve-docs/pct.1.html)
- [Linux `proc_loadavg` manual](https://man7.org/linux/man-pages/man5/proc_loadavg.5.html)
