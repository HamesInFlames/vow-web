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
