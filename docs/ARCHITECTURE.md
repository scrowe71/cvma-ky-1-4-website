# CVMA® Kentucky Chapter 1-4 website demo

## Preview and review

Serve `dist/` with any static web server, for example `python -m http.server 8080 --directory dist`, then open http://localhost:8080. No build or package install is required. The motorcycle-photo layout is the default. The Home page offers **01 · ODL & gold** and **02 · Motorcycle photo**. The original supplied JPEG remains unchanged in `dist/assets/odl.jpg`. The homepage uses a transparent-background presentation derivative in `dist/assets/odl-transparent.png`, made with the built-in image editor. Verify the derivative against approved artwork before public release. The supplied Vets Helping Vets flag graphic is displayed intact on About.

Six public pages are provided through hash navigation. Officer demo and Integration & deployment plan are additional review pages. Fonts and the stock photograph load from Google Fonts and Unsplash; system font and dark background remain if these are blocked. The motorcycle photograph is illustrative stock, not a chapter image: https://unsplash.com/photos/bOJp7Q6iN2E.

## What works today

- Responsive page navigation, two homepage designs, contact validation and unsent preview.
- Browser-local event creation, editing, deletion, and simulated Google imports.
- Role permission toggles, with Webmaster initially the sole full admin; other roles start denied.
- Browser-local JPEG/PNG/WebP uploads, image resizing, album names, caption editing, removal, and lightbox. Demo capped at 10 photos; not intended as a durable archive.
- Local activity log and reset. Data persists on the same browser origin, subject to browser storage policies. Clear browser data to remove it.

**Not live:** authentication, server authorization, Google Calendar access, webhooks, shared photo storage, email delivery, officer roster, actual events, and chapter social/contact details. The role selector is deliberately a simulation and provides no security. Never deploy it as an actual officer portal or store private chapter information here.

## Low-cost production design

Use Cloudflare Pages for static files, a Cloudflare Worker for authenticated APIs, D1 for identities/permissions/event-cache/photo metadata/audit records, and private R2 object storage for original photographs. This is a proposed architecture, not included backend code. The static demo can be deployed separately while backend implementation is commissioned.

At an assumed 5 MB per original, 250–1000 photos annually require approximately 1.25–5 GB/year, plus thumbnails, backups, and retention. Generate ~200 KB web derivatives and smaller thumbnails; use paginated album queries, lazy loading, and CDN caching. Keep originals private, strip EXIF location metadata, validate decoded content, restrict upload size/count, scan as appropriate, and publish only approved photos. Use scheduled backups and test restore. Confirm consent and removal procedures with the chapter.

R2 Standard currently includes 10 GB-month of storage, 1 million Class A and 10 million Class B operations per month, with no direct R2 egress charge. Free allowances are not a permanent cost guarantee. Retained originals will grow beyond the allowance. Confirm current Pages, Workers, D1, and R2 limits before launch; add billing alerts. Domain and optional email service cost extra. No compensation or fee paid to a chapter member is assumed. Normal hosting services may be paid directly by the chapter.

Pricing: https://developers.cloudflare.com/r2/pricing/

## Google Calendar two-way implementation

1. Create a chapter-controlled Google Cloud project, enable Calendar API, configure the OAuth consent screen, exact production redirect URI, and minimal required Calendar event scope. Google verification requirements depend on scopes and audience. Keep client secrets and encrypted refresh tokens on the backend only.
2. Create a dedicated chapter public-events calendar. Grant direct Google editing only to approved officers. Keep private/member-only schedules on a separate calendar that is never exposed by public endpoints. Website permissions do not supersede Google calendar ACLs.
3. Authenticate officers with Google OpenID Connect; validate issuer, audience, state/nonce, redirect URI, and approved identity. Seed exactly one verified Webmaster as full administrator. Deny everyone else until granted. Use secure HttpOnly SameSite cookies, CSRF protection, rate limits, and server checks on every event/photo/access operation. Do not trust a client role value.
4. Website edits call an authorized Worker endpoint. Create/update/delete Google events, preserving event IDs, timezone, recurrence, exceptions, and ETags. Use conditional writes (`If-Match`); return conflicts for user review. Use idempotent create/retry handling, durable audit records, and backoff for quotas. Cache only approved public fields after successful writes.
5. Initial read lists all pages and stores `nextSyncToken`. Create a Calendar events watch using an HTTPS webhook and random channel token. Validate channel ID, token, resource ID, and expiration. Notifications contain change signals, not event bodies; fetch deltas with the stored sync token, process all pages, handle cancelled events, then atomically advance the token. Handle HTTP 410 by full resync.
6. Renew expiring watch channels with a scheduled job; reconcile periodically in case notifications are missed. Deduplicate notifications and serialize per-calendar sync. Never let older webhook work overwrite a newer cache revision.
7. Revoke both site grants and Google calendar sharing when an officer leaves. Support token revocation and handover to another authorized Webmaster without browser storage.

Official documentation:
- https://developers.google.com/workspace/calendar/api/guides/sync
- https://developers.google.com/workspace/calendar/api/guides/push
- https://developers.google.com/workspace/calendar/api/v3/reference/events/update

## Deploy the static demo

1. Upload the contents of `dist/` to a static host such as Cloudflare Pages. Build command: none. Output directory: `dist`. Hash routes need no rewrite rules.
2. Keep review access private until chapter and State Representative approval. Sites publication, if available, uses `.openai/hosting.json`; this file is not needed for Cloudflare Pages.
3. Confirm both homepage layouts, mobile navigation, original ODL display, and demo labels on the target domain. Local demo data is separate for each origin/browser.

## Public launch checklist

Obtain State Representative review/approval for the chapter website under Brand Manual Revision B, pages 10, 17, and 19. Preserve all IP and registered marks; do not treat this build as an approval. Confirm official copy, leadership, dates, contact address, and image rights. Replace the role simulator and mock integrations with tested server implementations before enabling officer access. Provide a privacy notice for actual data handling. Configure email delivery and anti-spam controls if using the form.

Acceptance tests for production: unauthenticated and unauthorized direct API calls denied; Webmaster-only initial grants; revoked access denied; calendar writes reflected in Google; Google-side edits/deletions/recurrence reflected in cache; concurrent edits conflict; token expiry and watch renewal recover; private events never leak; upload permission enforced; invalid/oversized files rejected; pagination at 1000 photos; backup restore verified; keyboard/mobile/accessibility review.

Image edit prompt: Remove only the exterior white canvas to transparency; preserve skull artwork, colors, white spade outline and 1-4, retaining a small white backing behind the black registered mark for dark-background legibility. Built-in image editor used; no CLI generation.

Revision: registered mark changed to the red already in the image at the user�s direction; the small white backing was removed. The generated presentation derivative requires final brand review and is not claimed to be pixel-identical to the source.

Final ODL revision: uses the supplied original PNG skull pixels with exterior white canvas removed and a clean, smaller red vector registered mark. `dist/assets/odl-clean.svg` embeds the raster skull and draws only the registered mark as a circle and path. Previous generated variants are not used on the website.

Final ODL revision: uses the supplied original PNG skull pixels with exterior white canvas removed and a clean, smaller red vector registered mark. `dist/assets/odl-clean.svg` embeds the raster skull and draws only the registered mark as a circle and path. Previous generated variants are not used on the website.

Final ODL revision: uses the supplied original PNG skull pixels with exterior white canvas removed and a clean, smaller red vector registered mark. `dist/assets/odl-clean.svg` embeds the raster skull and draws only the registered mark as a circle and path. Previous generated variants are not used on the website.

Selected review image: dist/assets/odl-approved.png is copied directly from the user's accepted image. It supersedes the vector trademark experiment; no further edits applied.

Calendar revision: public Events navigation is now Calendar, opening the current Eastern month. Previous/next and Today controls change the displayed month. Event links open a detail view; narrow screens show the selected month as an agenda. Old #events URLs remain supported. Events are still browser-local sample data.
