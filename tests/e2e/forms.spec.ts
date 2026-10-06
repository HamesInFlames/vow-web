// The booking form with a (fake) Web3Forms key: JS and no-JS paths, errors, ?service= pre-fill.
// Runs in the `forms` project against dist-forms. Every POST to Web3Forms is intercepted; nothing is sent.
import { test, expect, type Request } from '@playwright/test';
import business from '../../src/data/business.json' with { type: 'json' };
import { FORMS_ORIGIN } from './origins';

const WEB3FORMS = 'https://api.web3forms.com/submit';
// Multipart (fetch with FormData) reads as-is; a no-JS POST is URL-encoded, so decode it.
const body = (req: Request) => {
  const raw = req.postDataBuffer()?.toString('utf8') ?? '';
  return /urlencoded/.test(req.headers()['content-type'] ?? '') ? decodeURIComponent(raw.replace(/\+/g, ' ')) : raw;
};

test.describe('with JS', () => {
  test('?service= ticks that service', async ({ page }) => {
    await page.goto('/book?service=winterizing');
    await expect(page.getByRole('checkbox', { name: 'Winterizing' })).toBeChecked();
    await expect(page.getByRole('checkbox', { name: 'Annual RV inspection' })).not.toBeChecked();
  });

  test('an unknown ?service= is ignored', async ({ page }) => {
    await page.goto('/book?service=nope');
    await expect(page.getByRole('checkbox', { name: 'Winterizing' })).not.toBeChecked();
  });

  test('empty submit shows the error summary and focuses the first bad field', async ({ page }) => {
    let posted = false;
    await page.route(WEB3FORMS, (route) => { posted = true; return route.abort(); });
    await page.goto('/book');
    await page.getByRole('button', { name: 'Send booking request' }).click();
    await expect(page.getByRole('alert').first()).toContainText('Please check the 3 fields');
    await expect(page.getByRole('textbox', { name: 'Your name' })).toBeFocused();
    await expect(page.getByRole('textbox', { name: 'Your name' })).toHaveAttribute('aria-invalid', 'true');
    expect(posted).toBe(false);
  });

  test('pick-up shows the address field only when chosen', async ({ page }) => {
    await page.goto('/book');
    await expect(page.getByLabel(/Where should we pick it up/)).toHaveCount(0);
    await page.getByLabel(/Please pick it up/).check();
    await expect(page.getByLabel(/Where should we pick it up/)).toBeVisible();
  });

  test('a valid request posts to Web3Forms and shows the confirmation in place', async ({ page }) => {
    let sent = '';
    await page.route(WEB3FORMS, (route) => {
      sent = body(route.request());
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    await page.goto('/book?service=winterizing');
    await expect(page.getByRole('checkbox', { name: 'Winterizing' })).toBeChecked();
    await page.getByRole('textbox', { name: 'Your name' }).fill('Test Person');
    await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('905-555-0100');
    await page.getByLabel('Year (optional)').fill('2018');
    await page.getByRole('checkbox', { name: /OK to contact me/ }).check();
    await page.getByRole('button', { name: 'Send booking request' }).click();
    await expect(page.getByRole('status')).toContainText('This is a request, not a confirmed booking.');
    expect(sent).toContain('test-key-not-real');
    expect(sent).toContain('Test Person');
    expect(sent).toContain('Winterizing');
    expect(sent).toContain('Service booking request');
  });

  test('a failed send says so and gives the phone number', async ({ page }) => {
    await page.route(WEB3FORMS, (route) => route.fulfill({ status: 500, contentType: 'application/json', body: '{"success":false}' }));
    await page.goto('/book');
    await page.getByRole('textbox', { name: 'Your name' }).fill('Test Person');
    await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('905-555-0100');
    await page.getByRole('checkbox', { name: /OK to contact me/ }).check();
    await page.getByRole('button', { name: 'Send booking request' }).click();
    await expect(page.getByRole('alert')).toContainText(`That didn’t go through. Please call us at ${business.phones.main}`);
  });
});

test.describe('without JS', () => {
  test.use({ javaScriptEnabled: false });

  test('the form posts to Web3Forms and lands on /thanks', async ({ page }) => {
    let sent = '';
    await page.route(WEB3FORMS, (route) => {
      sent = body(route.request());
      return route.fulfill({ status: 303, headers: { location: `${FORMS_ORIGIN}/thanks` } });
    });
    await page.goto('/book');
    // Without JS the pick-up address field is always there (it can't be revealed).
    await expect(page.getByLabel(/Where should we pick it up/)).toBeVisible();
    await page.getByRole('textbox', { name: 'Your name' }).fill('No Script');
    await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('905-555-0100');
    await page.getByRole('checkbox', { name: 'Leak detection and repair' }).check();
    await page.getByRole('checkbox', { name: /OK to contact me/ }).check();
    await page.getByRole('button', { name: 'Send booking request' }).click();
    await expect(page).toHaveURL(/\/thanks$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Thanks, we got it.');
    expect(sent).toContain('No Script');
    expect(sent).toContain('Leak detection and repair');
    expect(sent).toContain(`${FORMS_ORIGIN}/thanks`);
  });

  test('the browser still requires a name and the contact box', async ({ page }) => {
    let posted = false;
    await page.route(WEB3FORMS, (route) => { posted = true; return route.abort(); });
    await page.goto('/book');
    await page.getByRole('button', { name: 'Send booking request' }).click();
    await expect(page).toHaveURL(/\/book$/);
    expect(posted).toBe(false);
  });
});

test.describe('part request and insurance claim (with JS)', () => {
  test('?handover=pick-up selects pick-up on the booking form', async ({ page }) => {
    await page.goto('/book?handover=pick-up');
    await expect(page.getByLabel(/Please pick it up/)).toBeChecked();
    await expect(page.getByLabel(/Where should we pick it up/)).toBeVisible();
  });

  test('part request needs the part, then posts it', async ({ page }) => {
    let sent = '';
    await page.route(WEB3FORMS, (route) => {
      sent = body(route.request());
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    await page.goto('/parts/request');
    await page.getByRole('textbox', { name: 'Your name' }).fill('Parts Person');
    await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('905-555-0100');
    await page.getByRole('checkbox', { name: /OK to contact me/ }).check();
    await page.getByRole('button', { name: 'Send part request' }).click();
    await expect(page.getByLabel('What part do you need?')).toBeFocused();
    await page.getByLabel('What part do you need?').fill('Fresh water pump');
    await page.getByRole('button', { name: 'Send part request' }).click();
    await expect(page.getByRole('status')).toContainText('This is a request, not an order.');
    expect(sent).toContain('Fresh water pump');
    expect(sent).toContain('Part request');
  });

  test('insurance claim form posts the insurer and the damage', async ({ page }) => {
    let sent = '';
    await page.route(WEB3FORMS, (route) => {
      sent = body(route.request());
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    await page.goto('/insurance-claims');
    await page.getByRole('textbox', { name: 'Your name' }).fill('Claim Person');
    await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('905-555-0100');
    await page.getByLabel(/What kind of damage/).selectOption('Collision');
    await page.getByLabel(/Insurance company/).fill('Example Mutual');
    await page.getByRole('checkbox', { name: /OK to contact me/ }).check();
    await page.getByRole('button', { name: 'Send to the shop' }).click();
    await expect(page.getByRole('status')).toContainText('book an inspection');
    expect(sent).toContain('Example Mutual');
    expect(sent).toContain('Collision');
    expect(sent).toContain('Insurance claim repair');
  });
});

test.describe('consignment form', () => {
  test('?type= and ?removal= pre-fill; Facebook ad parameters ride along; JS send', async ({ page }) => {
    let sent = '';
    await page.route(WEB3FORMS, (route) => {
      sent = body(route.request());
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    await page.goto('/consign?type=park-home&removal=yes&utm_source=facebook&utm_campaign=fall-consign#consign-form');
    await expect(page.getByLabel(/What is it\?/)).toHaveValue('park-home');
    await expect(page.getByLabel(/Offsite/)).not.toBeChecked();
    await page.getByRole('textbox', { name: 'Your name' }).fill('Consign Person');
    await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('905-555-0100');
    await page.getByRole('textbox', { name: /Where is it now/ }).fill('Sunny Acres park');
    await page.getByRole('checkbox', { name: /OK to contact me/ }).check();
    await page.getByRole('button', { name: 'Send for a quote' }).click();
    await expect(page.getByRole('status')).toContainText('This is a request for a quote, not an agreement.');
    for (const v of ['Consign Person', 'park-home', 'Sunny Acres park', 'facebook', 'fall-consign', 'Consignment quote', 'removal_requested']) expect(sent).toContain(v);
  });

  test('ad parameters survive a tap on a unit-type tile (which reloads without them)', async ({ page }) => {
    let sent = '';
    await page.route(WEB3FORMS, (route) => {
      sent = body(route.request());
      return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    await page.goto('/consign?utm_source=facebook&utm_campaign=tile-test');
    await page.getByRole('region', { name: 'What we take' }).getByRole('link', { name: 'Snowmobiles', exact: true }).click();
    await expect(page).toHaveURL(/type=snowmobile/);
    await expect(page.getByLabel(/What is it\?/)).toHaveValue('snowmobile');
    await page.getByRole('textbox', { name: 'Your name' }).fill('Tile Person');
    await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('905-555-0100');
    await page.getByRole('checkbox', { name: /OK to contact me/ }).check();
    await page.getByRole('button', { name: 'Send for a quote' }).click();
    await expect(page.getByRole('status')).toBeVisible();
    expect(sent).toContain('tile-test');
    expect(sent).toContain('facebook');
  });

  test('production form never offers lawyer-gated types', async ({ page }) => {
    await page.goto('/consign');
    const options = await page.getByLabel(/What is it\?/).locator('option').allTextContents();
    expect(options.join('|')).not.toMatch(/Motorhome|Motorcycle|ATV/);
    expect(options.length).toBeGreaterThan(3);
  });

  test('without JS the consign form posts and lands on /thanks', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    let sent = '';
    await page.route(WEB3FORMS, (route) => {
      sent = body(route.request());
      return route.fulfill({ status: 303, headers: { location: `${FORMS_ORIGIN}/thanks` } });
    });
    await page.goto(`${FORMS_ORIGIN}/consign`);
    await page.getByRole('textbox', { name: 'Your name' }).fill('No Script Seller');
    await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('905-555-0100');
    await page.getByLabel(/What is it\?/).selectOption('travel-trailer');
    await page.getByRole('checkbox', { name: /OK to contact me/ }).check();
    await page.getByRole('button', { name: 'Send for a quote' }).click();
    await expect(page).toHaveURL(/\/thanks$/);
    expect(sent).toContain('No Script Seller');
    expect(sent).toContain('travel-trailer');
    await ctx.close();
  });
});

test('park home removal: the embedded form starts on park home + move it, and sends its own subject', async ({ page }) => {
  let sent = '';
  await page.route(WEB3FORMS, (route) => {
    sent = body(route.request());
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
  });
  await page.goto('/park-home-removal');
  // The form hydrates when it scrolls into view (client:visible); wait for that before clicking radios.
  await page.locator('#removal-form').scrollIntoViewIfNeeded();
  await expect(page.locator('#removal-form form[novalidate]')).toBeAttached();
  await expect(page.getByLabel(/What is it\?/)).toHaveValue('park-home');
  // Nothing pre-chosen: a removal-only visitor who skips the question mustn't read as "sell it".
  for (const label of [/Onsite/, /Offsite/, /Just move it/]) await expect(page.getByLabel(label)).not.toBeChecked();
  await page.getByLabel(/Just move it/).check();
  await page.getByRole('textbox', { name: 'Your name' }).fill('Mover Person');
  await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('905-555-0100');
  await page.getByRole('checkbox', { name: /OK to contact me/ }).check();
  await page.getByRole('button', { name: 'Send for a quote' }).click();
  await expect(page.getByRole('status')).toBeVisible();
  for (const v of ['Park home removal quote', 'Just move it', 'park-home', 'removal_requested']) expect(sent).toContain(v);
});

test('?vehicle= pre-selects a power-sports type on the booking form', async ({ page }) => {
  await page.goto('/book?vehicle=snowmobile');
  await expect(page.getByLabel('Type (optional)')).toHaveValue('Snowmobile');
});

test('financing form is contact-only: no SIN, date of birth, income or banking fields; sends', async ({ page }) => {
  let sent = '';
  await page.route(WEB3FORMS, (route) => {
    sent = body(route.request());
    return route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
  });
  await page.goto('/financing');
  const names = await page.locator('form[action*="web3forms"] [name]').evaluateAll((els) => els.map((e) => e.getAttribute('name')));
  expect(names.join(' ')).not.toMatch(/sin|birth|dob|income|bank|account|salary/i);
  await page.getByRole('textbox', { name: 'Your name' }).fill('Finance Person');
  await page.getByRole('textbox', { name: 'Phone', exact: true }).fill('905-555-0100');
  await page.getByLabel(/What would you like to finance/).fill('A park model');
  await page.getByRole('checkbox', { name: /OK to contact me/ }).check();
  await page.getByRole('button', { name: 'Ask us to call' }).click();
  await expect(page.getByRole('status')).toContainText('This isn’t a credit application.');
  expect(sent).toContain('Financing question');
});
