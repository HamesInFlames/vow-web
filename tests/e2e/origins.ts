// The local servers the tests use (playwright.config.ts starts them). One place for the ports.
// 435x, not 432x: buro-rvfarm-web's tests use 4321+, and the two repos' verify runs can overlap (Oct 12: VOW's run
// reused RV Farm's preview server on 4321 and tested the wrong site).
export const SITE_ORIGIN = 'http://localhost:4351'; // dist/ (production build, no form key)
export const FORMS_ORIGIN = 'http://localhost:4352'; // dist-forms/ (same site with a fake Web3Forms key)
export const REVIEW_ORIGIN = 'http://localhost:4354'; // dist-review/ (PUBLIC_REVIEW=1: confirm and lawyer chips)
