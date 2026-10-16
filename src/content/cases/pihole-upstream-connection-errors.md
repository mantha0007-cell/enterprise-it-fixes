---
title: "Pi-hole upstream connection errors and delayed DNS"
slug: "pihole-upstream-connection-errors-delayed-dns"
description: "Trace Pi-hole DNS delays from the client through FTL to its configured upstream resolver, and weigh resilience against sending queries to additional providers."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "Pi-hole FTL DNS resolver"
vendor: "Pi-hole"
versions: ["Pi-hole FTL; upstream behavior and settings depend on version"]
category: "Networking"
tags: ["Pi-hole", "DNS", "Unbound", "upstream resolver", "connection errors", "privacy"]
errorCodes: []
eventIds: []
logFiles: ["Pi-hole FTL diagnosis", "Pi-hole DNS query log"]
symptoms: ["Pi-hole reports a connection error to an upstream resolver.", "DNS lookups are delayed while Pi-hole reports resolver or query-queue warnings."]
visibility: published

sources:
  - label: "Pi-hole: DNS resolver behavior"
    url: "https://docs.pi-hole.net/ftldns/dns-resolver/"
  - label: "Pi-hole: Configuration — connection error reporting"
    url: "https://docs.pi-hole.net/ftldns/configfile/"
  - label: "Pi-hole: Unbound guide"
    url: "https://docs.pi-hole.net/guides/dns/unbound/"
  - label: "Pi-hole: Upstream DNS providers"
    url: "https://docs.pi-hole.net/guides/dns/upstream-dns-providers/"
---

## Short answer

A Pi-hole upstream connection error means FTL could not complete a connection to a configured resolver for that request. Start by identifying which resolver failed and whether the failure repeats; adding public DNS servers can change privacy and filtering behavior, so it is not a neutral default fix. A warning about concurrent requests also does not, by itself, prove that a universal fixed query ceiling was reached.

## Our diagnostic lens

Follow one lookup along its path: client → Pi-hole → selected upstream. This separates a client-to-Pi-hole problem from a Pi-hole-to-resolver problem. Pi-hole may try other configured forward destinations after certain response failures or a timeout, but multiple upstream entries should not be described as a permanent ordered primary/backup pair: FTL uses response history to choose destinations.

## Symptoms

- Pi-hole Diagnosis or its log reports a connection error for an upstream address or local resolver port.
- A client lookup is delayed or fails while Pi-hole itself remains reachable.
- A second warning mentions many outstanding or concurrent queries.

The full message, Pi-hole version, selected upstream, and time are useful evidence. Avoid relying on a number shown in one warning as a fixed limit for every release or configuration.

## Investigation

1. **Check the affected hop.** Confirm that the client can reach Pi-hole, then inspect the Pi-hole query log and FTL messages for the same time. A failure to reach Pi-hole differs from an upstream connection error.
2. **Identify the configured resolver.** Check whether the target is an external provider or a local service such as Unbound. For a local resolver, verify that the service is active and listening on the configured address and port.
3. **Test the resolver directly.** From the Pi-hole host, query the selected upstream directly with a diagnostic DNS tool, then query through Pi-hole. Compare success and response time. Use a harmless public test name and avoid sharing private query logs.
4. **Check network and service evidence.** Review resolver logs, firewall rules, routing, and recent service restarts around the failure time. A connection refusal, timeout, and premature close point to different checks.
5. **Confirm version-specific behavior.** Capture the complete warning and installed FTL version. A warning that mentions a numeric limit should be matched to that version's implementation or documentation; do not confuse an outstanding-query warning with the resolver's cache-size setting.

## Likely causes

- The upstream service is stopped, restarting, or listening on a different address or port.
- A firewall, route, or local network interruption prevents the connection.
- The resolver is responding slowly or closing connections, so requests take longer to complete.
- The selected upstream is valid but has intermittent connectivity.
- DNS is functioning through another configured resolver, while the failed upstream still produces a warning.

These are diagnostic possibilities, not a root-cause conclusion. Correlate the same request across FTL and the upstream service before changing configuration.

## Choosing a recovery strategy

If a local Unbound resolver is intended to handle all forwarding, first repair or stabilize that service and confirm direct queries to it. This keeps the resolver path and privacy model unchanged.

If availability requires another provider, review what that provider logs or filters, whether it supports the required DNS behavior, and how Pi-hole selects among configured upstreams. Pi-hole documents that it learns the fastest responding destination and can try other destinations after `SERVFAIL`, `REFUSED`, or a timeout. Do not assume that adding two servers guarantees that the second is used only when the first is offline.

Change one element at a time, keep a record of the previous upstream settings, and validate both successful DNS resolution and the intended filtering/privacy behavior. Avoid suppressing connection warnings as a repair; Pi-hole notes they can indicate intermittent network or upstream problems.

## How to check the result

- The intended upstream answers direct test queries consistently.
- A lookup through Pi-hole completes without matching connection errors.
- FTL and the upstream service remain healthy during ordinary client activity.
- The chosen upstream arrangement still meets the network's filtering, logging, and privacy requirements.

## Version note on queue warnings

The exact wording and reported limit can depend on the Pi-hole/FTL and embedded resolver versions or configuration. The number in a warning should not be confused with the DNS cache size: Pi-hole's resolver documentation discusses cache sizing separately and notes a historical dnsmasq cache limit that was removed upstream. Use the full warning and running version to determine what the message means in a specific installation.

## Vendor sources

- [Pi-hole DNS resolver behavior](https://docs.pi-hole.net/ftldns/dns-resolver/)
- [Pi-hole configuration: connection error reporting](https://docs.pi-hole.net/ftldns/configfile/)
- [Pi-hole guide: using Unbound](https://docs.pi-hole.net/guides/dns/unbound/)
- [Pi-hole guide: upstream DNS providers](https://docs.pi-hole.net/guides/dns/upstream-dns-providers/)
