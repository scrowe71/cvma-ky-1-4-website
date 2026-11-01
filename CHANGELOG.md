# Changelog

## v1.4.0 – 2026-11-01
- Site content moved out of the code into editable files in site/content/: Home, About, Officers, Calendar events, Photo albums, Contact
- Pages CMS set up (.pages.yml) so officers can edit those sections in a browser at app.pagescms.org, on the dev branch
- Event and album web addresses now come from their titles (e.g. #calendar/2026-11-21-monthly-chapter-meeting)
- Browsers that saved an older copy of the demo calendar always show the current chapter events
- Officer demo page points to Pages CMS for real changes; its own tools remain a browser-only demonstration
- Calendar events are editable in Pages CMS until Google Calendar is connected
- Public pages look exactly the same as v1.3.2

## v1.3.2 – 2026-11-01
- Version number change only (no site changes), to tell the development build apart from production

## v1.3.1 – 2026-10-31
- Site icon (browser tab, bookmarks, phone home screen) from the approved Chapter 1-4 ODL, scaled down without changes

## v1.3.0 – 2026-10-31
- Officers page lists the chapter officers with names and email links: Commander, Executive Officer, Treasurer, Secretary, Sergeant at Arms, Public Relations Officer, Chaplain, Quartermaster, Road Captains, Webmaster (TBD)
- Removed the "placeholder roles" notice
- "Photo coming soon" placeholder picture for each officer (not Road Captains); real photos can replace it one at a time

## v1.2.1 – 2026-10-31
- Added ZIP code 47150 to the Liberty Place address (Annual Chapter Picnic)

## v1.2.0 – 2026-10-31
- Removed the made-up sample events (Veterans community ride, Chapter fellowship, Winter service day), including from returning visitors' saved copies
- Added chapter events:
  - Monthly Chapter Meeting – Sat Oct 17 2026, 10:30, Bluegrass Harley-Davidson (past event)
  - Annual Chapter Picnic – Sat Oct 17 2026, 13:00, Liberty Place, 2633 Grant Line Road, New Albany, IN (past event)
  - Bikes & Boneheads – Sat Oct 24 2026, registration 9:00 AM, Harley-Davidson of Louisville, 1700 Arthur St, Louisville, KY 40208 (past event)
  - Monthly Chapter Meeting – Sat Nov 21 2026, 10:30–12:30, Bluegrass Harley-Davidson, 2755 Terra Crossing Blvd, Louisville, KY 40245
  - Monthly Chapter Meeting & Christmas Party – Sat Dec 12 2026, 17:00–21:00, AMVETS Post 61, 9405 Smyrna Pkwy, Louisville, KY 40229
- Events can carry an end time, street address with map link, and a green "Chapter event" label; past events show a "Past event" label
- Home page "Coming together" lists upcoming events only
- Event pages link to the venue's website: Liberty Place, Harley-Davidson of Louisville, Bluegrass Harley-Davidson (AMVETS Post 61 has no website of its own, so it shows the address and map link only)
- Photo gallery: new "Bikes & Boneheads" album (Oct 24, 2026, 4 photos) with full-size viewer; linked from the event page. License plate blurred; photo location data removed
- Photo gallery: new "Chapter Picnic 2026" album (17 photos, Liberty Place), linked from the Annual Chapter Picnic event; albums list newest first
- Photo viewer: previous/next buttons, left/right arrow keys and swipe on phones; wraps from last photo to first

## v1.1.0 – 2026-10-31
- Footer shows the site version
- Development site labels itself DEVELOPMENT next to the version
- Automatic check: footer version must match the newest CHANGELOG entry

## v1.0.1 – 2026-10-31
Documentation only; website unchanged.
- Corrected production and development addresses to cvma-ky-1-4-website.pages.dev
- Documented the old cvma-ky-1-4-preview address forwarding to production

## v1.0.0 – 2026-10-31
Baseline production release, identical to the site previously hand-uploaded to cvma-ky-1-4-preview.pages.dev.
- Motorcycle background homepage; approved ODL with red ®; layout switch removed
- Header "CVMA® KY Chapter 1-4" on one line
- Pages: Home, About, Officers, Calendar, Gallery, Contact, plus officer demo and integration plan
- Calendar opens to current month with month navigation and clickable event details
- Google Calendar, officer login, photo storage and email are simulated
