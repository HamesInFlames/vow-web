# Architecture Decisions — Vacations on Wheels website

<!-- Log all significant decisions here. Newest at the bottom. -->

### 2026-10-05 — Plan approved (`docs/plan.md`)
- James said "go" on the Stage 1 plan, including its 14 overrides of the vault's `40-mock-sites-plan.md` (plan §3a), and "create the repo".
- Railway is not approved yet; nothing deploys.

### 2026-10-05 — Seeded from RV Farm by copying files (plan V1)
- **Context:** `40` §8 said `npx degit ../buro-rvfarm-web`. RV Farm's history carries 55 MB of inventory photos.
- **Decision:** `git archive 8a90ab7` of `buro-rvfarm-web` without `src/assets/inventory`, `docs` and `tasks`, then inventory, fees, price and RV Farm-only pages removed. Fixes made in RV Farm after `8a90ab7` must be ported by hand.
- **Renames:** `dealership.json` → `business.json`; tokens `sand` → `mist` (page background), `bark` → `slate` (text), `orange` → `accent` (logo red); `sand` kept only for the "Photo coming" block. `scripts/photos.mjs` removed until a VOW photo is confirmed (Phase 2 re-adds it from RV Farm with the VOW watermark).

### 2026-10-05 — Approved packages (plan §4)
- The RV Farm list (`buro-rvfarm-web/tasks/decisions.md`, 2026-10-02), unchanged and installed from its lockfile with `npm ci`: astro 7, @astrojs/react + react + react-dom, tailwindcss + @tailwindcss/vite, @astrojs/sitemap, motion, sharp, @astrojs/check, typescript, @playwright/test + Chromium, @axe-core/playwright, @lhci/cli, @types/react(-dom).

### 2026-10-05 — Repo guardrails
- `.claude/settings.json`, `.claude/hooks/guard.ps1` and `.claude/agents/Explore.md` copied from RV Farm at `8a90ab7`. James asked to keep his newer working-copy `guard.ps1`; Claude's copy of it was denied (the guard protects `.claude/hooks`), so **James copies it by hand**: `Copy-Item ..\buro-rvfarm-web\.claude\hooks\guard.ps1 .claude\hooks\guard.ps1`.
- Consequence, as on RV Farm: pushes to `main` are blocked by the hook; James merges.

### 2026-10-05 — Colours from the VOW logo (plan V3)
- Sampled from `016-Vacation_Logo.png`: red `#BE1A2C` (brand/accent), black. Text-safe red `#9A1020` (8.5:1 on white), charcoal `#111315` utility row, cool greys (`mist #EEF1F4`, `paper #F8F9FB`, `slate #262B31` text). `npm run contrast`: all 16 pairs pass.
- The header sets "Vacations on Wheels" in text beside the badge; the badge lettering is unreadable at 48–64 px.

### 2026-10-05 — Sibling link goes to thervfarm.ca
- RV Farm's new site isn't on a domain yet and `rvfarm.ca` returned 403, so the cross-link uses RV Farm's current live site, `thervfarm.ca` (`business.json` `sibling.url`, `[confirm]`). Switch when the new RV Farm site launches.

### 2026-10-05 — Phase 1: services data and form testing
- **Services:** 12 JSON files, one per service, in a content collection. The 4 services not on the current site are `confirmed: false` and don't build in production. Unverified FAQ answers carry a `confirm` note and are hidden in production, the same rule as `claims.json`. No prices until Paul gives them ("Quote after inspection").
- **Form tests without a real key:** a second build with a fake `PUBLIC_WEB3FORMS_KEY` into `dist-forms` (`VOW_OUT_DIR`), served on port 4322 by the Playwright `forms` project; the POST to Web3Forms is intercepted. The production build without a key still shows the call block (tested). No new packages.
- **Booking fields:** follow plan §1 row 5. The date field is a plain date input ("pick any day in the week"), since `type="week"` isn't supported in Safari or Firefox. Consent is required. No photo upload (V9): the form says we'll tell them where to send photos when we call.

### 2026-10-05 — Phase 2: what counts as confirmed, and three forms only
- **Site facts:** what VOW’s own current site says it does is treated like the 8 services and shown in production: the insurance-claim repair list, Global Warranty extended plans by name (provider PDFs linked, brochure text not reproduced, V6), pick-up with “applicable pick-up fees”, parts in store or ordered in, and the NTP catalogue link. Unsourced claims and processes stay `[confirm]` and review-only: the claim steps, insurers, warranty makers, pick-up radius and return trip, the Onan stock, staff facts, and the estimate-approval sentence in the terms.
- **Three forms (plan §1):** the island’s `general` kind was removed; `/contact` has no form and links to the three request pages instead.
- **Header:** flat nav for now (no dropdown panels); at 1024–1279 px the Call button shows “Call” only.

### 2026-10-06 — GitHub CLI installed on the MSI laptop (James asked)
- **What:** `gh` 2.102.0 via `winget install GitHub.cli` (machine tool, not a project dependency; nothing added to package.json).
- **Why:** repository settings (default branch) and PR work from Claude Code; the GitHub connector can’t change repo settings.
- **Limits unchanged:** pushes to `main` stay blocked by the guard hook; James merges.

### 2026-10-06 — Railway: review service `vow-web` (James asked: "using railway cli add the vow web to it")
- **Where:** project empowering-wholeness (with `rvfarm-web` and `rvfarm-interim`), environment production. Service `vow-web`, GitHub repo HamesInFlames/vow-web, branch `dev`, Dockerfile build (Caddy serving `dist/`).
- **URL:** https://vow-web-production.up.railway.app (Railway domain; no custom domain).
- **Variables:** `PUBLIC_REVIEW=1` (yellow [confirm] chips), `PUBLIC_SITE_ORIGIN` = the Railway URL. No `PUBLIC_WEB3FORMS_KEY` yet (forms show the call block). No `PUBLIC_ALLOW_INDEX`, so `robots.txt` disallows everything.
- **Every push to `dev` redeploys the review site.** Production (`main`, launch) is a separate decision.

### 2026-10-06 — VOW Phase 4: consignment, removal, power sports, financing (vault `20` 2026-10-06; `prompts/build-vow-phase4-consign.md`)
- **V15 consignment (`/consign`):** VOW sells park models, mobile homes, trailers, snowmobiles, boats and watercraft for their owners. Motorhomes, motorcycles and ATVs/UTVs are in `src/data/consign.json` with `lawyer: true`: review builds show them with a "[lawyer to review]" chip; production hides them; `lawyer: false` publishes one (no code change). Terms (20% commission, payout timing) stay `[confirm]`. "No upfront cost" appears only beside the cost sentence (content check enforces it).
- **Park home removal (`/park-home-removal`):** the PDF's five services in plain words. "Fully insured", "MTO oversize permits", "8 to 80 feet" and "every park" are unverified claims in `claims.json`.
- **V16 power sports (`/power-sports`):** service and parts for motorcycles, ATVs/UTVs, snowmobiles, boats; the job list is review-only `[confirm]`. The booking and part forms gain these four vehicle types (`?vehicle=`); the claim form doesn't.
- **V17 financing (`/financing`):** contact-only form kind `financing`; no lender, rates or payment examples; the lender line and what-can-be-financed list are review-only.
- **V18 rates:** Paul's Oct 5 list is final (vault `20`): `business.json` `rates` ($199/h trailers, $249/h motorhomes, $6.50/km), winterizing `fromPriceCad: 199` with `priceFormat: "plus-parts"`. "Written estimate before any work" beside the rates (CPA Part VI); any estimate fee is `[confirm]`. "Vacations Global Warranty $2,495" is review-only on `/warranty`.
- **Header:** dropdown panels (`<details>`, close on Escape or outside click). Warranty moved into the Services panel. Below 1536 px the desktop Call button shows "Call" only (the number is in the utility row). Tested at 320/375/1024/1280/1440.
- **Tests:** a `review` Playwright project builds `dist-review` (PUBLIC_REVIEW=1) on port 4324 to check lawyer and confirm chips. Parallel test builds each get their own Astro `cacheDir`.
- **Lawyer list:** `docs/confirm-report.md` has a "For the lawyer" section (lawyer-gated types plus `<Confirm lawyer>` flags in the terms and financing pages).
- **RV Farm (step 6, separate repo):** `fees.json` PDI $1,995 (was $2,995), admin $599 confirmed; the "$599 vs $499" notes removed (`buro-rvfarm-web` commit `deb78ca`).
