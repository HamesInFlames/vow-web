# Session Status — Vacations on Wheels website

## Last session
- **Date:** 2026-10-05 (afternoon), started from the RV Farm repo session with the vault added
- **Tool used:** Claude Code (Opus 5.5)
- **What was done:**
  - Research: Sonnet subagent compiled every VOW fact, decision and open question in the vault. A second one captured the live vacationsonwheels.ca (18 of 37 pages; the September audit only had the homepage) into `docs/site-capture/`. New facts: the only published email is vacationsonwheel@gmail.com; the "Warranty" page is a Global Warranty extended-plan brochure; Dometic appears nowhere on the site; many unsourced claims (V14). The Turnkey firewall then **temporarily blocked this machine's IP** on both Turnkey sites (vacationsonwheels.ca and thervfarm.ca).
  - Stage 1: `docs/plan.md` (scorecard, 5 differentiators, 14 overrides of `40`, sitemap, data, tokens, components, 17 h phases, `[confirm]` list, risks). James: "go, create the repo, keep guard.ps1".
  - Phase 0: seeded from `buro-rvfarm-web` at `8a90ab7` (see `decisions.md`); inventory, fees, price, estimator, lightbox, filter and the RV Farm-only pages removed; `business.json` for VOW; tokens from the logo; header (badge + name in text), footer, charcoal utility row, sticky bar (Call · Directions, Book once `/book` exists); AutoRepair JSON-LD; VOW favicons; home shell (hero with a "Photo coming" block, the 8 current services as text, unverified pick-up/Spanish claims via `<Claim>`, RV Farm cross-band, visit block); 404 and sitemap; `claims.json` with the 7 unsourced claims; content check bans the current site's leftovers (dealer copy, "Hold With Deposit", "Buy Now", "4.3/5"…); AGENTS/CLAUDE/tasks.
- **Verification (Phase 0, actual):** `npm run verify`: contrast 16/16 pairs pass; unit 10/10; `astro check` 0 errors; build 3 pages; content grep 0 hits; confirm report 20 open items; Playwright 14/15. **The one failure is the link crawl: `https://thervfarm.ca → 403`**, because the Turnkey firewall is blocking this IP after the capture ("temporarily blocked for suspicious behaviour", confirmed with curl on both Turnkey sites). Re-run `npm run test:e2e` once the block lifts. Committed anyway, with this noted (James's call to revisit). Screenshots at 1440/375 of `/`, `/404`, `/sitemap` reviewed: fixed the footer email tap target (20 → 44 px) and added the business name beside the unreadable badge in the header.
- **Not done:** `guard.ps1` working copy (Claude was denied; James copies it, see `decisions.md`); Railway (not approved); Web3Forms key.
- **What's next:** Phase 1 in a fresh session opened in this folder (vault prompt `prompts/build-vow-web.md`).

## Context for next session
- RV Farm-only habits to drop: no inventory, no fees, no advertised price. Prices here only when Paul confirms them.
- Every service beyond the 8 on the current site, every brand, insurer, certification, price and photo is `[confirm]` (plan §5).
- The Google rating (4.4★, ~140) lives in `business.json` `google` with `confirmed: false`.
