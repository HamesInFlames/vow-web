# Tasks — Vacations on Wheels website

Plan: `docs/plan.md` (§3g phases). Approved Oct 5, 2026.

## In progress
- [ ] Header dropdown panels (plan §3b: Services / Parts / About). The nav is flat for now; Contact and Reviews are reached via About and the footer
- [ ] Photo pipeline (RV Farm scripts/photos.mjs + VOW watermark): only once Rae confirms a photo (V11)
- [ ] Reviews: James picks 3–6 Google reviews into src/data/reviews.json; Rae OKs quoting them
- [ ] Phase 4 — walkthrough with Paul and Rae (James): the sheet is ready at `docs/walkthrough-vow.md` (26 questions covering all 65 confirm items, cross-referenced to RV Farm sheet Part 5); then apply the answers (the sheet has an answer → file table)
- [ ] Optional: whole-branch `/code-review high` on `5e5c53d..HEAD` (the Oct 6 review only covered Phase 3)

## Blocked / waiting on James
- [ ] Paul and Rae's answers (`docs/walkthrough-vow.md`; plan §5)
- [ ] Web3Forms access key for VOW forms (`PUBLIC_WEB3FORMS_KEY`); until then forms show a call block
- [ ] vacationsonwheels.ca is registered to Turnkey; nothing launches on it until the registrant is Paul's company (vault `92`)
- [ ] A vector VOW logo (the badge is a 392 px raster)

## Completed
- [x] Railway review service `vow-web` from `dev`: https://vow-web-production.up.railway.app (Oct 6)
- [x] Phase 3 — `/code-review high` findings (8) fixed; `main` created from `dev` and made the default branch (Oct 6)
- [x] Phase 4 prep — `docs/walkthrough-vow.md` (Oct 6)
- [x] Phase 3 (part) — Lighthouse mobile 99–100 on 16 page types, emulated Android 4/4, print styles (Oct 5)
- [x] Phase 2 — /insurance-claims, /warranty, /pick-up-and-delivery, /parts, /parts/request, /about, /reviews, /contact, privacy/terms/accessibility drafts, home sections 5–8, part and claim forms, confirm report (65 items) (Oct 5)
- [x] Phase 1 — services collection (12; 4 hidden in production), `/services`, 8 service pages, `/book`, `/thanks`, home tiles + winterizing band + rating line; form tests with a test-key build (Oct 5)
- [x] Phase 0 — seeded from `buro-rvfarm-web` at `8a90ab7`, inventory removed, VOW tokens from the logo, `business.json`, header/footer/utility row/sticky bar, favicons, home shell, AGENTS/CLAUDE/tasks, guardrails (Oct 5)
- [x] Stage 1 — `docs/plan.md`, live-site capture `docs/site-capture/` (18 of 37 pages) (Oct 5)
