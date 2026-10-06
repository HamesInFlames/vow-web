// The booking form with a (fake) Web3Forms key: JS and no-JS paths, errors, ?service= pre-fill.
// Runs in the `forms` project against dist-forms. Every POST to Web3Forms is intercepted; nothing is sent.
import { test, expect, type Request } from '@playwright/test';

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
    await expect(page.getByRole('alert')).toContainText('That didn’t go through. Please call us at 905-738-1253');
  });
});

test.describe('without JS', () => {
  test.use({ javaScriptEnabled: false });

  test('the form posts to Web3Forms and lands on /thanks', async ({ page }) => {
    let sent = '';
    await page.route(WEB3FORMS, (route) => {
      sent = body(route.request());
      return route.fulfill({ status: 303, headers: { location: 'http://localhost:4322/thanks' } });
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
    expect(sent).toContain('http://localhost:4322/thanks');
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
