# Change workflow: development → production

**Rule: production is never changed directly.** Every change is made on `dev`, tested on the development site, approved, and only then promoted to production.

## 1. Make the change on `dev`

All edits are committed to the `dev` branch (never to `main`). Cloudflare automatically publishes every push to `dev` at:

`https://dev.cvma-ky-1-4.pages.dev`

## 2. Test on the development site

Automatic: GitHub runs `tests/check.cjs` on every push and pull request.

By hand, on the dev address, on both a phone and a computer:

- [ ] Home page loads with the motorcycle background and the approved ODL (no white box, red ®)
- [ ] Header reads "CVMA® KY Chapter 1-4" on one line
- [ ] Every menu page opens: Home, About, Officers, Calendar, Gallery, Contact
- [ ] Calendar opens to the current month; previous / next / Today work; clicking an event opens its details
- [ ] The change itself works as intended
- [ ] Nothing else changed that shouldn't have

## 3. Approve and promote

1. On GitHub, open a **pull request** from `dev` into `main`.
   Title it with the new version, e.g. `Release v1.1.0 – add mobile menu`.
2. The automatic check must show green.
3. The approver (Webmaster, or whoever the chapter designates) reviews the dev site and the checklist, then clicks **Merge**.
4. Cloudflare publishes `main` to production within a minute or two.
5. Add the release to `CHANGELOG.md` (on `dev`) and tag the release `vX.Y.Z` on `main`.

## 4. If production breaks

In Cloudflare: **Workers & Pages → cvma-ky-1-4 → Deployments**, find the last good production deployment, and choose **Rollback to this deployment**. Then fix the problem on `dev` and promote it normally.

## Version numbers

`vMAJOR.MINOR.PATCH`. Patch = small fix (typo, color). Minor = new feature or page. Major = redesign or going live with real Google/email services.

## Protections in place

- GitHub ruleset on `main`: changes only by pull request, the automatic check must pass, no force-pushes, no deletion.
- Cloudflare production branch = `main`; preview deployments limited to `dev`.
- No uploads through the Cloudflare dashboard. The project is Git-connected, so drag-and-drop is not used.
