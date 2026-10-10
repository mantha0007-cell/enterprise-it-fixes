---
title: "Chrome downloads PDF instead of preview"
slug: "chrome-pdf-download-instead-of-preview-accounting-portal"
description: "Troubleshoot a missing PDF preview in a Windows accounting portal by separating Chrome's PDF preference from the portal's HTTP response."
datePublished: 2026-10-09
dateModified: 2026-10-10
product: "Google Chrome for Windows"
vendor: "Google"
versions: ["Chrome on Windows; exact browser and portal versions not specified"]
category: "Endpoint Management"
tags: ["Google Chrome", "PDF", "accounting portal", "PDF viewer", "DocumentFile.aspx", "HTTP headers", "Windows 11", "downloads"]
errorCodes: []
eventIds: []
logFiles: []
symptoms: ["A portal shows a generic file tile or download action instead of a PDF preview", "PDF content downloads rather than opening in Chrome", "The surrounding invoice or document details load but the attached PDF does not preview"]
visibility: published
sources:
  - label: "Google Chrome Help: Manage PDFs in Chrome"
    url: "https://support.google.com/chrome/answer/16215622?hl=en"
  - label: "Google Chrome Help: Download a file"
    url: "https://support.google.com/chrome/answer/95759?hl=en"
  - label: "IETF RFC 6266: Content-Disposition in HTTP"
    url: "https://www.rfc-editor.org/rfc/rfc6266.html"
  - label: "IANA Media Types registry"
    url: "https://www.iana.org/assignments/media-types"
---

## Short answer

If Chrome downloads a PDF instead of displaying it, check Chrome’s PDF preference first: open `chrome://settings/content/pdfDocuments` and select **Open PDFs in Chrome**. Reload the portal and try the document again. If it still shows only a file tile or download action, inspect how the portal serves the document; the browser preference cannot correct a response that is delivered as an attachment or is not actually a PDF.

## What the symptom tells you

A document page can load correctly while its PDF preview fails. That separates the portal’s document metadata from the file response, but it does not identify the cause. The generic filename `DocumentFile.aspx`, if shown, is an endpoint name and does not prove that the response body or headers describe a PDF.

There are two layers to check:

| Layer | What to check | What the result suggests |
|---|---|---|
| Chrome PDF handling | Whether Chrome is set to open PDFs or download them | A setting change that restores the preview points to browser handling as a contributing factor. |
| Portal response | The final request status, response content type, and content disposition | A download disposition, non-PDF response, redirect, or error page points to portal delivery or authentication. |

## Check Chrome’s PDF preference

1. In the affected Chrome profile, enter `chrome://settings/content/pdfDocuments` in the address bar.
2. Select **Open PDFs in Chrome**.
3. Return to the portal and reload the document page.
4. Open the same document again and check whether Chrome’s PDF viewer appears.

The setting applies to Chrome’s handling of PDFs in that browser profile. It does not change the Windows `.pdf` default app, repair the portal, or override every server response or organization policy. On a managed browser, check whether an administrator policy controls PDF behavior before changing settings repeatedly.

## If the preview still does not appear

Use Chrome Developer Tools only if you are authorized to inspect the portal:

1. Open Developer Tools with **F12** and select **Network**.
2. Open the affected document again and identify the request that returns the file. A URL ending in `DocumentFile.aspx` may be a useful clue, but do not assume its name describes its contents.
3. Select the request and inspect its final status and response headers. Do not copy the request URL or headers into a public ticket: they may contain invoice identifiers, session cookies, or access tokens.
4. For an inline PDF, check whether the response is identified as `Content-Type: application/pdf`. Check `Content-Disposition` as well: `attachment` asks the browser to save the response, while `inline` indicates normal processing for its media type.
5. If the response is an authentication page, an error, or a different media type, send the sanitized finding to the portal administrator or vendor. Do not alter server headers from the browser.

Example of the relevant response headers:

```http
Content-Type: application/pdf
Content-Disposition: inline; filename="document.pdf"
```

These values are useful checks, not a guarantee of successful preview. The portal may use a separate embedded viewer, redirects, or application-specific delivery logic.

## Check extensions or browser policy

If Chrome’s setting says **Open PDFs in Chrome** but the file still downloads, check whether the browser is managed and whether a PDF or security extension changes how documents are handled. If permitted, test with a clean Chrome profile or temporarily disable a nonessential extension for that test profile. Do not disable organization-required security extensions on a work device without approval from its administrator.

## Protect financial documents during troubleshooting

Use a non-sensitive sample document when testing general PDF behavior. Never upload a real invoice to a public PDF test site. Before sharing a Network-panel capture, remove customer and supplier names, invoice numbers, account details, full document URLs, cookies, authorization headers, and other access tokens. Often the response status and a small set of redacted headers are enough for support to continue.

## Diagnostic summary

- **The preview starts working after changing Chrome’s PDF preference:** browser PDF handling was likely involved; confirm the behavior in the affected profile.
- **Chrome still downloads the document and the response says `attachment`:** the portal is instructing the browser to treat it as a download; ask the portal owner to review that response path.
- **The response is not `application/pdf` or redirects to a sign-in/error page:** investigate portal delivery or access before changing Chrome again.
- **A direct or sample PDF works but the portal document does not:** Chrome’s general PDF viewer works, so focus on the portal’s embedded-viewer path and response.

## Sources

- [Manage PDFs in Chrome](https://support.google.com/chrome/answer/16215622?hl=en)
- [Download a file in Chrome](https://support.google.com/chrome/answer/95759?hl=en)
- [IETF RFC 6266: Content-Disposition in HTTP](https://www.rfc-editor.org/rfc/rfc6266.html)
- [IANA Media Types registry](https://www.iana.org/assignments/media-types)

This guide describes a general browser and document-delivery pattern. The exact cause depends on the portal response, Chrome profile, and any organization policy; verify those in the affected environment before changing server or browser configuration.
