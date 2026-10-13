# Tasks — Vacations on Wheels website

Plan: `docs/plan.md` (§3g phases). Approved Oct 5, 2026.

## In progress
- [ ] Winterizing ad: on hold (Rae, Oct 8: Paul isn't interested in a winterizing deal). The site says trailers $199, motorhomes $249, plus parts and HST
- [ ] Photo `018-image-7.png` (motorhome on red lifts): Rae says it's VOW's (Oct 8), but it isn't the shop in `015` and looks like stock; James checks before adding it to `src/data/photos.json`
- [ ] Reviews: James picks and pastes quotes into src/data/reviews.json himself with Rae's OK (no star counts; the site shows no Google rating, Oct 13: 3.4★ from 45)
- [ ] Open answers from Rae/Paul: the HOLD list in `tasks/status.md` (Oct 12) and `docs/confirm-report.md` (45 items)
- [ ] Lawyer: OMVIC status for consigning motorhomes, motorcycles, ATVs/UTVs (`consign.json` `lawyer` → `false` publishes a type), consignment agreement terms, financing/loan-broker question (vault `95`)
- [ ] Optional: whole-branch `/code-review high` on `5e5c53d..HEAD` (the Oct 6 review only covered Phase 3)

## Blocked / waiting on James
- [ ] Web3Forms access key for VOW forms (`PUBLIC_WEB3FORMS_KEY`); until then forms show a call block
- [ ] vacationsonwheels.ca is registered to Turnkey; nothing launches on it until the registrant is Paul's company (vault `92`)
- [ ] A vector VOW logo (the badge is a 392 px raster)

## Completed
- [x] Exact Google listing, place-ID directions and write-review links; rating line and any rating/aggregateRating removed; review invite on /reviews and footer; confirm report 48 → 45 (Oct 13)
- [x] Rae's Oct 8 answers applied (vault `96a`): hours, email, socials, prices, estimate fee, services, claims, consignment, removal, warranty, financing; photo pipeline and the hero photo; confirm report 88 → 48 (Oct 12)
- [x] VOW Phase 4 — `/consign`, `/park-home-removal`, `/power-sports`, `/financing`, Paul's rates, header dropdown panels, RV Farm fees ($1,995 PDI, $599 admin), review (11 findings fixed) (Oct 6)
- [x] Railway review service `vow-web` from `dev`: https://vow-web-production.up.railway.app (Oct 6)
- [x] Phase 3 — `/code-review high` findings (8) fixed; `main` created from `dev` and made the default branch (Oct 6)
- [x] Phase 4 prep — `docs/walkthrough-vow.md` (Oct 6)
- [x] Phase 3 (part) — Lighthouse mobile 99–100 on 16 page types, emulated Android 4/4, print styles (Oct 5)
- [x] Phase 2 — /insurance-claims, /warranty, /pick-up-and-delivery, /parts, /parts/request, /about, /reviews, /contact, privacy/terms/accessibility drafts, home sections 5–8, part and claim forms, confirm report (65 items) (Oct 5)
- [x] Phase 1 — services collection (12; 4 hidden in production), `/services`, 8 service pages, `/book`, `/thanks`, home tiles + winterizing band + rating line; form tests with a test-key build (Oct 5)
- [x] Phase 0 — seeded from `buro-rvfarm-web` at `8a90ab7`, inventory removed, VOW tokens from the logo, `business.json`, header/footer/utility row/sticky bar, favicons, home shell, AGENTS/CLAUDE/tasks, guardrails (Oct 5)
- [x] Stage 1 — `docs/plan.md`, live-site capture `docs/site-capture/` (18 of 37 pages) (Oct 5)
