# One-time setup: GitHub + Cloudflare (about 20 minutes)

## A. GitHub repository

1. Sign in or sign up at https://github.com (free account; your personal email is fine for now).
2. Click **+ → New repository**.
   - Name: `cvma-ky-1-4-website`
   - Visibility: **Public**. The site is public anyway and the repo holds no passwords or keys. GitHub's free plan only enforces branch protection on public repositories.
   - Leave "Add a README" **unchecked**.
   - Click **Create repository**.
3. On the empty repo page, click **uploading an existing file**.
4. Unzip `cvma-ky-1-4-website-repo.zip`, open the `cvma-ky-1-4-website` folder, select **everything inside it** (including the `.github` folder), and drag it onto the page.
5. Commit message: `v1.0.0 baseline`, then click **Commit changes**. This creates the `main` (production) branch.
6. Create the dev branch: click the **main** branch dropdown, type `dev`, and choose **Create branch dev from main**.

## B. Protect production (`main`)

**Settings → Rules → Rulesets → New ruleset → New branch ruleset**
- Name: `Protect production`
- Enforcement: **Active**
- Target branches: **Add target → Include default branch** (`main`)
- Check: **Restrict deletions**, **Block force pushes**, **Require a pull request before merging**, **Require status checks to pass** (add the check named `check`; it appears after the first automatic run)
- **Create**

From then on, nothing (including you) can change `main` except by merging an approved pull request from `dev`.

## C. Cloudflare Pages project (Git-connected)

1. https://dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorize GitHub and select `cvma-ky-1-4-website`.
3. Settings:
   - Project name: `cvma-ky-1-4`
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: `site`
4. **Save and Deploy.** Production goes live at `https://cvma-ky-1-4.pages.dev`.
5. **Settings → Builds → Branch control**: Preview branches → **Custom branches**, include `dev`. Then push any change to `dev` (or click **Retry deployment**) and the development site appears at `https://dev.cvma-ky-1-4.pages.dev`.

## D. Retire the old hand-uploaded site

Once both new addresses work, update the link in the board email and the presentation to `https://cvma-ky-1-4.pages.dev`. Then delete the old `cvma-ky-1-4-preview` project (**Settings → Delete project**) so there is only one production site and it can't be hand-uploaded to.
