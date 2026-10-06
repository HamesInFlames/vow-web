// The two local servers the tests use (playwright.config.ts starts both). One place for the ports.
export const SITE_ORIGIN = 'http://localhost:4321'; // dist/ (production build, no form key)
export const FORMS_ORIGIN = 'http://localhost:4322'; // dist-forms/ (same site with a fake Web3Forms key)
