---
title: "OneDrive files sync but do not appear in PhotoPrism"
slug: "photoprism-onedrive-sync-files-not-visible"
description: "Trace missing PhotoPrism media across the cloud sync, host storage, container mount, and library indexing stages before rerunning a job."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "PhotoPrism with OneDrive and rclone"
vendor: "PhotoPrism; rclone; Microsoft"
versions: ["PhotoPrism and rclone versions vary by deployment"]
category: "File synchronization"
tags: ["PhotoPrism", "OneDrive", "rclone", "file synchronization", "indexing", "containers"]
errorCodes: []
eventIds: []
logFiles: ["rclone sync log", "PhotoPrism indexing log"]
symptoms: ["A sync task reports success, but expected OneDrive photos are absent from PhotoPrism.", "Files exist in cloud storage but are not visible in the PhotoPrism library."]
visibility: published

sources:
  - label: "PhotoPrism: Library indexing and import"
    url: "https://docs.photoprism.app/user-guide/library/index.html"
  - label: "PhotoPrism: Indexing originals"
    url: "https://docs.photoprism.app/user-guide/library/originals/"
  - label: "PhotoPrism: Frequently asked questions about storage"
    url: "https://docs.photoprism.app/getting-started/faq/"
  - label: "rclone: Microsoft OneDrive backend"
    url: "https://rclone.org/onedrive/"
---

## Short answer

A successful cloud transfer and a visible PhotoPrism library entry are separate outcomes. Trace one expected file through four boundaries: the OneDrive source, the sync destination on the host, the folder mounted into the PhotoPrism container, and PhotoPrism's indexing step. This identifies the first stage where the file is missing without repeatedly transferring the full library.

## Our diagnostic lens

Treat the pipeline as a sequence of independent checks, not one “sync” status. A transfer task can finish while scanning the wrong source folder, writing to a path the container cannot see, or leaving newly copied files outside the last index run. Conversely, PhotoPrism may index files from its originals folder without changing those files. Separate the file-transfer check from the library-index check.

## Symptoms

- The scheduled or manual sync job reports success, but recent media does not appear in search or the timeline.
- A file can be found in OneDrive, but it is unclear whether the local copy exists.
- A local copy may exist on the host even though the PhotoPrism container or library does not show it.

## Investigation

1. **Choose one safe test file.** Use a non-sensitive image with a known folder and filename. Avoid posting personal photo names or logs publicly.
2. **Confirm the remote source.** Verify that the configured OneDrive remote can list the expected folder and file. Check whether the sync job includes that folder and media type; a job can succeed while intentionally skipping files outside its selection.
3. **Read the latest transfer result.** Check the newest log and exit status rather than relying on an old “success” line. Distinguish “nothing needed transfer” from an error, and inspect any skipped, throttled, or failed items.
4. **Check the destination on the host.** Verify that the test file exists at the local destination and has a plausible size and modification time. If it is missing here, focus on the remote path, filters, permissions, or transfer task.
5. **Check the container mount.** Confirm the same file is visible and readable inside the PhotoPrism container at the configured originals location. Host and container paths can differ; verify the actual mount rather than assuming that a successful host transfer makes the file available to the application.
6. **Check the PhotoPrism library step.** Confirm the folder is part of the configured originals library and run or inspect the appropriate index operation for that deployment. The index task's status and log are separate from the cloud sync status.

## Likely causes

- The sync source or folder selection does not include the expected file.
- A filter, filename mapping, or permissions issue prevents a file from reaching the destination.
- The file reached a host directory that is not mounted into the PhotoPrism container.
- PhotoPrism is configured to use a different originals folder, or the library has not indexed the new file.
- A transfer warning appears in a log even though a later operation completed; correlate timestamps and final exit status before treating it as a current failure.

## Suggested response

Fix the first failing boundary found in the checks above. If the remote cannot list the source, correct the remote or account selection. If the host copy is absent, review the sync scope and transfer errors. If the file is on the host but absent in the container, correct the mount or permissions. If it is readable under the configured originals folder, investigate PhotoPrism indexing.

Before changing an automated transfer, check its deletion behavior. A one-way copy and a mirror operation have different consequences if a source file is removed. Keep the existing destination safe until you have confirmed what the current job is designed to delete or retain.

## How to check the result

- The test file can be listed on the remote and at the expected host destination.
- The file is readable inside the container under the configured originals folder.
- PhotoPrism's library view or search finds the file after its indexing operation completes.
- The latest transfer and indexing logs show no unresolved failure for the test file.

## Scope note

This guide describes a general self-hosted workflow. PhotoPrism installations differ in storage mounts, Docker or LXC configuration, indexing schedules, and rclone options. Do not copy another installation's local paths, service names, or credentials into your own environment.

## Vendor sources

- [PhotoPrism library indexing and import](https://docs.photoprism.app/user-guide/library/index.html)
- [PhotoPrism indexing originals](https://docs.photoprism.app/user-guide/library/originals/)
- [PhotoPrism storage FAQ](https://docs.photoprism.app/getting-started/faq/)
- [rclone Microsoft OneDrive backend](https://rclone.org/onedrive/)
