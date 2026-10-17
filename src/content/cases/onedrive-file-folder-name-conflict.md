---
title: "OneDrive says a file or folder with this name already exists"
slug: "onedrive-file-folder-name-conflict"
description: "Diagnose OneDrive's same-name sync warning by comparing the trigger, local and cloud item types, account, and sync state before changing files."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "OneDrive for Windows"
vendor: "Microsoft"
versions: ["OneDrive sync app for Windows; interface labels may change"]
category: "File synchronization"
tags: ["onedrive", "sync-conflict", "files-on-demand", "windows", "personal-account"]
errorCodes: []
eventIds: []
logFiles: ["OneDrive sync activity and notifications"]
symptoms: ["OneDrive reports that a file or folder with the same name already exists", "A local OneDrive folder is accessible but its cloud counterpart has not been verified", "More than one personal or work OneDrive account is signed in on the same PC"]
visibility: published
sources:
  - label: "Microsoft Support: The file or folder already exists in OneDrive"
    url: "https://support.microsoft.com/en-us/onedrive/the-file-or-folder-already-exists-in-onedrive"
  - label: "Microsoft Support: Save disk space with OneDrive Files On-Demand for Windows"
    url: "https://support.microsoft.com/en-us/onedrive/save-disk-space-with-onedrive-files-on-demand-for-windows"
  - label: "Microsoft Support: Restrictions and limitations in OneDrive and SharePoint"
    url: "https://support.microsoft.com/en-us/onedrive/restrictions-and-limitations-in-onedrive-and-sharepoint"
  - label: "Microsoft Support: Fix problems uploading files on the OneDrive website"
    url: "https://support.microsoft.com/en-us/onedrive/fix-problems-uploading-files-on-the-onedrive-website"
---

## Short answer

The message identifies a name collision, but it does not by itself tell you which item conflicts, whether the local and online items have the same type, or whether the cloud copy is current. First note what changed immediately before the warning, then compare the exact path in the correct OneDrive account on the PC and on OneDrive.com. Keep the files in place until you have confirmed which copy is authoritative and have a separate backup.

Microsoft documents one specific situation: after you deselect a folder in OneDrive's folder-selection settings, the client can report that the file or folder already exists. That scenario has a different remedy from an unexplained collision during normal sync, so do not assume the workaround applies unless the warning followed that action.

## Establish the scope before troubleshooting

Write down the exact warning, the full local path, the time it appeared, and the action immediately before it. Check which cloud icon and account are involved. A PC can have both a personal OneDrive and a work or school OneDrive; the same folder name in separate roots is not by itself evidence of a collision inside one account.

In File Explorer, inspect the exact parent folder and the named item, including hidden items if relevant. Record whether the local item is a file or a directory and whether OneDrive shows it as synced, pending, or in error. Do not treat a cloud-file placeholder or reparse-point attribute alone as proof of damage: Files On-Demand uses placeholders so cloud files can appear in Explorer without all their contents being stored locally.

Then open OneDrive.com in the matching account and navigate to the same parent path. Compare the item name and whether it is a file or folder. If you cannot access the online location or the account is uncertain, mark the cloud state as unknown; an empty result from an incomplete query is not evidence that the cloud folder is empty or missing.

## Follow the branch that matches the trigger

### The warning appeared after changing folder selection

Microsoft documents this message after a folder is deselected from the list of folders to sync. Confirm that this is the actual trigger and read Microsoft's current workaround carefully. One documented option moves the local folder outside the OneDrive sync structure; Microsoft's article explains that the cloud copy is then removed and the data remains only on the PC. That changes where the data lives, so make a separate verified copy first and do not use this route if the goal is to retain the cloud folder.

### The warning appeared during ordinary sync

Compare the online and local item at the exact path. Check for a file on one side and a folder on the other, a second item with a similar name, or a collision introduced by another device or a recent rename. OneDrive's web upload guidance documents a file-without-an-extension versus same-named-folder case; use that as a specific possibility when the item types fit, not as a universal explanation for all sync warnings.

If the name and type match, review the OneDrive sync activity for the affected path and whether another device is creating or renaming the item. Check for unsupported characters or names only if the UI points to a naming restriction. Keep account roots separate while comparing; do not move a work item into a personal account's tree as a test.

## Safe diagnostic sequence

1. Capture the full warning and its timestamp. Note whether it began after a folder-selection change, rename, account sign-in, or another device's update.
2. Confirm which OneDrive account owns the local root and open that same account online.
3. Compare the precise parent path and item type on both sides: file or folder. Include hidden items when checking the local parent.
4. Check OneDrive's activity for the affected path and record whether sync is complete, pending, or failed. A zero-valued summary counter or a failed online inventory does not settle the cloud state.
5. Make an independent copy of important local data before any move, rename, unlink, reset, or deletion.
6. Apply a fix only after the conflicting item and intended source of truth are known. Change one item at a time, then confirm both the web and PC views and the OneDrive sync status.

For a controlled test, use a new temporary folder with a harmless sample file. Do not reproduce the collision by moving or deleting the affected backup folder.

## Avoid these premature fixes

- Do not delete the local folder just because the online copy might exist; verify the online contents and account first.
- Do not rename the folder until you know whether a name collision, a file-versus-folder mismatch, or a sync-selection change caused the warning.
- Do not reset or unlink OneDrive as the first diagnostic step. These actions do not identify which copy is authoritative.
- Do not interpret a placeholder attribute as corruption or a zero-result cloud lookup as an empty drive.
- Do not claim the issue is solved until the affected path is present as intended on the web and PC, and OneDrive reports that sync has completed.

## What a confirmed resolution looks like

The cause is confirmed only when the relevant online and local items have been compared in the right account and the triggering condition is understood. After a targeted change, verify the path and contents on both sides, check the OneDrive activity for completion, and confirm that unrelated files remain intact. If the online comparison could not be completed, leave the diagnosis open and preserve the files.

## Sources

- [The file or folder already exists in OneDrive](https://support.microsoft.com/en-us/onedrive/the-file-or-folder-already-exists-in-onedrive)
- [Save disk space with OneDrive Files On-Demand for Windows](https://support.microsoft.com/en-us/onedrive/save-disk-space-with-onedrive-files-on-demand-for-windows)
- [Restrictions and limitations in OneDrive and SharePoint](https://support.microsoft.com/en-us/onedrive/restrictions-and-limitations-in-onedrive-and-sharepoint)
- [Fix problems uploading files on the OneDrive website](https://support.microsoft.com/en-us/onedrive/fix-problems-uploading-files-on-the-onedrive-website)

This is general troubleshooting guidance, not a conclusion about any particular account or file. Microsoft may update client behavior and portal labels; check the linked guidance before changing sync or cloud contents.
