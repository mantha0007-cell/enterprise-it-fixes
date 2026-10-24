---
title: "Outlook notifications appear without sound: check the app and Windows layers"
slug: "outlook-notification-sound-missing"
description: "A visible Outlook reminder with no sound can come from Outlook's notification choice, Windows notification policy, mute state, or the selected audio output."
datePublished: 2026-10-24
dateModified: 2026-10-24
product: "New Outlook for Windows and Classic Outlook for Windows"
vendor: "Microsoft"
versions: ["Windows 11; menu names can vary by Outlook version and update channel"]
category: "Email"
tags: ["outlook", "notifications", "calendar-reminders", "windows-11", "audio"]
errorCodes: []
eventIds: []
logFiles: []
symptoms: ["Outlook displays a calendar reminder but plays no sound", "New-mail notifications arrive silently", "Sound works in other apps but not for one Outlook notification type"]
visibility: published
sources:
  - label: "Microsoft Support: Turn new message alert pop-up on or off in Outlook"
    url: "https://support.microsoft.com/en-gb/outlook/getstarted/turn-new-message-alert-pop-up-on-or-off-in-outlook?redirectsourcepath=%252fen-us%252farticle%252fturn-desktop-alerts-on-or-off-a83fe224-3109-4de0-a1ab-c33fd103a422"
  - label: "Microsoft Support: Add or delete notifications or reminders in Outlook"
    url: "https://support.microsoft.com/en-us/outlook/calendar/add-or-delete-notifications-or-reminders-in-outlook"
  - label: "Microsoft Support: Notifications and Do Not Disturb in Windows"
    url: "https://support.microsoft.com/en-us/windows/experience/notifications-and-do-not-disturb-in-windows"
  - label: "Microsoft Support: Turn sound effects on or off in Outlook"
    url: "https://support.microsoft.com/en-us/outlook/turn-sound-effects-on-or-off-in-outlook"
---

## Short answer

If an Outlook reminder appears but is silent, the notification itself is working; the missing sound needs a separate check. New Outlook, Classic Outlook, and Windows each expose different controls. Check the setting for the affected notification type first, then check Windows' per-app sound permission, the volume mixer, and the selected output device.

## First identify the Outlook version and notification

New Outlook and Classic Outlook have different settings. Also test mail and calendar reminders separately: one can be silent while the other makes a sound.

### New Outlook for Windows

1. Open **Settings → General → Notifications**.
2. Expand **Mail** and inspect the sound for **New email**. Expand **Calendar** and inspect **Event reminders**.
3. Select a specific sound instead of **None** or an unavailable/default choice, then use the built-in test control if the current version displays one.
4. If notifications should arrive while Outlook is closed, also check Outlook's background-notification options and the matching Windows permission. Those options affect delivery while the app is closed; they are separate from choosing a sound.

Microsoft documents custom sounds for mail notifications, mail reactions, and calendar reminders in New Outlook, but availability can depend on the app version and rollout. If the menu is absent, update Outlook and recheck the current Microsoft guidance rather than editing undocumented settings.

### Classic Outlook for Windows

- For new mail, open **File → Options → Mail** and check **Play a sound**.
- For reminders, open **File → Options → Advanced → Reminders** and check **Play reminders sound**. The reminder sound file can be selected there.
- Windows' Control Panel sound scheme can also select the **New Mail Notification** WAV sound. Restart Outlook after changing that system sound.

Do not apply Classic Outlook steps to New Outlook; their controls are not interchangeable.

## Check Windows only after the Outlook setting

1. In **Settings → System → Notifications**, make sure notifications are enabled globally and for the installed Outlook app. Check the app's **Play a sound** option.
2. Open **Settings → System → Sound → Volume mixer**. Confirm Outlook is not muted and its volume is audible.
3. Check the active output device. A disconnected dock, headset, or monitor can receive the sound even while the reminder appears on screen.
4. Check **Do not disturb** and its automatic rules. This may suppress or defer Windows banners and sounds; compare whether the reminder appears in Outlook itself or as a Windows notification.
5. Play a known Windows test sound. If it is also silent, troubleshoot Windows audio/output before changing Outlook again.

## Use a small test matrix

| Test | Result | What to check next |
| --- | --- | --- |
| Windows test sound | Silent in every app | Output device, master volume, device mute, or audio driver |
| Windows test sound works; only one Outlook event is silent | Outlook's setting for that event type and Outlook version |
| Mail is audible; calendar reminder is silent, or vice versa | Separate Mail and Calendar sound choices |
| Sound works while Outlook is open but not when closed | New Outlook background notification permission and notification delivery settings |
| Test sound works, Outlook setting is enabled, but notifications remain silent | Windows per-app sound permission, volume mixer, focus settings, then update/restart Outlook |

## Avoid misleading fixes

- A visible reminder does not prove its sound is enabled; sound and visual notification controls can be separate.
- A Windows calendar system sound is not necessarily the sound used by every Outlook version.
- Do not change registry values to troubleshoot sound before checking the supported app and Windows controls.
- Avoid reinstalling Office or resetting an Outlook profile until the simple per-type and per-app checks isolate a wider application problem.

## Sources

- [Microsoft Support: Turn new message alert pop-up on or off in Outlook](https://support.microsoft.com/en-gb/office/turn-new-message-alert-pop-up-on-or-off-in-outlook-9940c70e-bast)
- [Microsoft Support: Add or delete notifications or reminders in Outlook](https://support.microsoft.com/en-us/outlook/calendar/add-or-delete-notifications-or-reminders-in-outlook)
- [Microsoft Support: Notifications and Do Not Disturb in Windows](https://support.microsoft.com/en-us/windows/experience/notifications-and-do-not-disturb-in-windows)
- [Microsoft Support: Turn sound effects on or off in Outlook](https://support.microsoft.com/en-us/outlook/turn-sound-effects-on-or-off-in-outlook)
