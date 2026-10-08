---
title: "Outlook emails appear online but are missing in Classic Outlook"
slug: "outlook-emails-missing-from-classic-outlook"
description: "Diagnose mail visible in Outlook on the web but missing in Classic Outlook by checking folder scope, view, sync state, and the local OST cache."
datePublished: 2026-10-08
dateModified: 2026-10-08
product: "Classic Outlook for Windows"
vendor: "Microsoft"
versions: ["Classic Outlook with an Exchange or Microsoft 365 account; exact build not specified"]
category: "Email"
tags: ["Outlook", "exchange-online", "OST", "Cached Exchange Mode", "mail synchronization", "missing emails"]
errorCodes: []
eventIds: []
logFiles: []
symptoms: ["Messages are visible in Outlook on the web but absent from the matching folder in Classic Outlook.", "The affected folder remains empty or out of date while Outlook appears connected."]
visibility: published

sources:
  - label: "Microsoft: Synchronization problems in Outlook and OWA"
    url: "https://learn.microsoft.com/en-us/troubleshoot/outlook/synchronization/synchronization-issues-occur-in-outlook-owa"
  - label: "Microsoft Support: Re-create an offline Outlook Data File (.ost)"
    url: "https://support.microsoft.com/en-us/outlook/open-or-import-items-from-an-offline-outlook-data-file-ost"
  - label: "Microsoft Learn: Plan and configure Cached Exchange Mode"
    url: "https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/configuration/cached-exchange-mode"
  - label: "Microsoft Support: Sync a shared mailbox in new Outlook"
    url: "https://support.microsoft.com/en-us/outlook/sharing/sync-a-shared-mailbox-in-new-outlook"
---

## Short answer

If the same messages are present in Outlook on the web but missing from the matching folder in Classic Outlook, the server copy exists and the difference is in the desktop client's view or synchronization. Check the selected mailbox and folder, search or view filters, connection state, and sync status before rebuilding the local cache. Recreating the OST can restore a stale local copy, but it does not identify why that copy stopped matching the server.

## Our diagnostic lens

Keep three things separate: **the mailbox on the server, what the Outlook window is showing, and the offline copy stored on this PC**. A connected status only describes the connection; it does not prove that every folder has synchronized. Likewise, a successful cache rebuild proves that a fresh copy can be populated, not that the previous file was corrupt or why it became stale.

This guide covers Classic Outlook for Windows with an Exchange or Microsoft 365 account. New Outlook uses different sync behavior; an OST reset in Classic Outlook is not a general repair for New Outlook.

## Symptoms

- Messages can be found in Outlook on the web but not in the corresponding Classic Outlook folder.
- One folder is empty or behind while other Outlook functions appear normal.
- Outlook may show itself as connected even though the folder contents do not match.

## Environment and scope

Classic Outlook for Windows using an Exchange-connected account and Cached Exchange Mode. The same visual symptom can have different causes. A mailbox quota warning, a local cache problem, a search filter, and a shared-mailbox sync delay are separate possibilities that need separate checks.

## Investigation

1. **Match the location.** In Outlook on the web, confirm the account, mailbox, and exact folder containing the messages. In Classic Outlook, expand the same mailbox and folder. If the folder belongs to a shared mailbox, keep that distinction explicit.
2. **Remove view and search ambiguity.** Clear the current search, confirm that no filter or focused view is hiding messages, and check the folder's sort order and date range.
3. **Check the connection and sync state.** Make sure Classic Outlook is not working offline. Run **Send/Receive → Update Folder** for the affected folder and allow synchronization to finish. If available, compare server and offline item counts in the folder's synchronization properties and review the Sync Issues folder for a matching time.
4. **Check the local sync range.** Cached Exchange Mode can keep only a configured time range on the PC. If the missing messages are older, check the account's **Mail to keep offline** setting and whether Outlook offers a way to load older items from Exchange.
5. **Check shared-folder caching only when relevant.** If the affected folder is in a shared mailbox, verify the profile's shared-folder download setting and current sync status. Disabling shared-folder caching changes offline availability and may affect performance, so test it only for the relevant profile and follow your organization's change process.
6. **Check mailbox capacity separately.** A message visible online can still be missing from the desktop cache. Verify any quota notice against the actual mailbox or administrator view instead of inferring that the mailbox is full from a local sync symptom.

## Likely causes

- A search, view, or folder-selection difference makes the messages appear absent.
- Classic Outlook has not completed synchronization for the affected folder.
- The local OST cache is stale or has a synchronization problem.
- A shared mailbox or its folders are being cached differently from the primary mailbox.
- The messages fall outside the configured local cache range.

The symptom alone does not distinguish these causes. Compare the same mailbox and folder first, then use sync evidence to decide whether a cache rebuild is warranted.

## Suggested troubleshooting steps

Start with the reversible checks above. If the affected messages remain online, the correct folder is selected, and the folder still does not synchronize, rebuilding the OST may help:

1. Confirm that the required messages are present on the server. Preserve any drafts, Outbox items, or other local-only content that has not synchronized; Microsoft notes that server-absent local data needs to be exported before the OST is removed.
2. Close Classic Outlook completely.
3. Locate the OST file actually used by the affected Outlook profile. Use the profile's account or data-file settings rather than guessing from a standard path or running a broad cleanup script.
4. Remove or, where your support process allows, rename only that OST file. Do not delete PST files or every Outlook cache file.
5. Start Classic Outlook while online and let it create and populate a fresh OST. Large mailboxes can take time to synchronize.

If the file cannot be identified confidently, the mailbox contains unsynchronized local data, or the issue returns after a rebuild, stop and involve the organization's messaging support team. Do not repeatedly delete the cache as a substitute for finding ongoing sync failures.

## How to check the result

- Confirm that the same messages appear in the matching folder in both Outlook on the web and Classic Outlook.
- Let initial synchronization complete, then compare the folder again after a restart or manual update.
- If the messages disappear again, record the time, folder type (primary or shared), Outlook connection state, sync status, and any relevant Sync Issues entry for support.

## New Outlook note

These OST steps apply to Classic Outlook. New Outlook has separate synchronization behavior, including for some shared mailboxes. Diagnose that client with its own sync controls and current Microsoft guidance; do not assume a Classic Outlook cache reset changed New Outlook's local state.

## Vendor sources

- [Synchronization problems in Outlook and OWA](https://learn.microsoft.com/en-us/troubleshoot/outlook/synchronization/synchronization-issues-occur-in-outlook-owa)
- [Open or import items from an offline Outlook Data File (.ost)](https://support.microsoft.com/en-us/outlook/open-or-import-items-from-an-offline-outlook-data-file-ost)
- [Plan and configure Cached Exchange Mode](https://learn.microsoft.com/en-us/microsoft-365-apps/outlook/configuration/cached-exchange-mode)
- [Sync a shared mailbox in new Outlook](https://support.microsoft.com/en-us/outlook/sharing/sync-a-shared-mailbox-in-new-outlook)
