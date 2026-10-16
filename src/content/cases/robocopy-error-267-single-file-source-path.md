---
title: "Robocopy error 267 when copying a single file"
slug: "robocopy-error-267-single-file-source-path"
description: "Fix the source-path shape for a single-file Robocopy job: pass the containing folder as source and the filename as a separate filter."
datePublished: 2026-10-17
dateModified: 2026-10-17
product: "Robocopy"
vendor: "Microsoft"
versions: ["Windows 10, Windows 11, and supported Windows Server versions"]
category: "Deployment"
tags: ["Robocopy", "error 267", "file copy", "PowerShell", "Windows"]
errorCodes: ["267", "ERROR_DIRECTORY"]
eventIds: []
logFiles: ["Robocopy log"]
symptoms: ["Robocopy returns ERROR 267 when a file path is supplied where a directory is expected.", "The source command line ends with a directory separator after the filename."]
visibility: published

sources:
  - label: "Microsoft: Robocopy command reference"
    url: "https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy"
  - label: "Microsoft: System error codes"
    url: "https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes--0-499-"
---

## Short answer

Robocopy expects a source directory, then a destination directory, then an optional file-name pattern. For a single file, pass its parent folder as the source and the file name as the filter. Do not turn the file path into a directory by appending a trailing slash.

## Correct command shape

```bat
robocopy "C:\SourceFolder" "D:\DestinationFolder" "archive.iso" /R:2 /W:3 /LOG:"C:\Logs\copy.log"
```

Replace the example paths and file name with values you have checked. The command copies only the named file and writes a log. Create the log directory first if it does not exist.

## Why the path matters

The Robocopy command format is `robocopy <source> <destination> [<file>] [<options>]`. The first argument must identify a directory. If a file path is placed in that position, particularly with a trailing backslash, Robocopy may try to treat the file as a directory and Windows can return error 267 (`ERROR_DIRECTORY`).

## Safe checks before retrying

1. Confirm the source file exists in the stated parent directory.
2. Confirm the destination is the intended directory and has enough free space.
3. Run a narrowly scoped copy for the single file and inspect the log and Robocopy exit code.
4. Add options only when their effects are understood. `/J` can suit large files; `/MT` is intended for multithreaded copies and is not needed for a one-file syntax repair.
5. Avoid `/MIR` or `/PURGE` for a simple copy. Those options can remove destination files that are not present in the source.

For a PowerShell one-file copy, `Copy-Item -LiteralPath 'C:\SourceFolder\archive.iso' -Destination 'D:\DestinationFolder'` is another option when Robocopy-specific logging or restart behavior is not needed.

## How to check the result

Confirm the destination file exists, compare its size with the source, and review the log for a successful copy. For important files, use an approved hash comparison or application-level validation as well.

## Sources

- [Robocopy command reference](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/robocopy)
- [System error codes 0–499](https://learn.microsoft.com/en-us/windows/win32/debug/system-error-codes--0-499-)
