import { expect, test } from '@playwright/test'

test('capture to plan happy path', async ({ page }) => {
  await page.goto('/gentle-adhd-flow/')

  await expect(page.getByRole('heading', { name: 'Gentle ADHD Flow' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Star repo/i })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/gentle-adhd-flow',
  )
  await expect(page.getByRole('link', { name: /PayPal/i })).toHaveAttribute(
    'href',
    'https://www.paypal.com/paypalme/florinbadita',
  )

  await page
    .getByLabel('Brain dump')
    .fill('email Alex tomorrow about invoice. daily stretch every morning.')
  await page.getByRole('button', { name: /Extract/i }).click()

  await expect(
    page.getByLabel('Plan').getByRole('heading', { name: 'Email Alex about invoice' }),
  ).toBeVisible()
  await expect(page.getByLabel('Habits').getByRole('heading', { name: 'Stretch' })).toBeVisible()
  await expect(page.getByText(/Commit/)).toBeVisible()
})

test('imports a note file, autosaves draft, exports, resets, and restores', async ({ page }) => {
  await page.goto('/gentle-adhd-flow/')

  await page.setInputFiles('input[accept*=".markdown"]', {
    name: 'notes.md',
    mimeType: 'text/markdown',
    buffer: Buffer.from('email Dana tomorrow about budget. daily stretch every morning.'),
  })

  await expect(page.getByLabel('Brain dump')).toContainText('From notes.md')
  await page.reload()
  await expect(page.getByLabel('Brain dump')).toContainText('From notes.md')

  await page.getByRole('button', { name: /Extract/i }).click()
  await expect(
    page.getByLabel('Plan').getByRole('heading', { name: 'Email Dana about budget' }),
  ).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: /^Export$/ }).click()
  const download = await downloadPromise
  const exportPath = await download.path()
  expect(exportPath).toBeTruthy()

  await page.getByRole('button', { name: /Reset workspace/i }).click()
  await expect(
    page.getByLabel('Plan').getByRole('heading', { name: 'Email Dana about budget' }),
  ).toBeHidden()

  await page.setInputFiles('input[accept=".json,application/json"]', exportPath!)
  await expect(
    page.getByLabel('Plan').getByRole('heading', { name: 'Email Dana about budget' }),
  ).toBeVisible()
})

test('copies plan text, shares state, and honors voice setting', async ({ page, context }) => {
  await page.goto('/gentle-adhd-flow/')
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
    origin: new URL(page.url()).origin,
  })

  await page.getByLabel('Brain dump').fill('call Mira tomorrow about tickets.')
  await page.getByRole('button', { name: /Extract/i }).click()
  await page.getByRole('button', { name: /Copy plan/i }).click()

  await expect(page.getByLabel('Plan').getByText(/copied/i)).toBeVisible()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('Call Mira about tickets')

  await page.getByRole('button', { name: /^Share$/ }).click()
  await expect(page).toHaveURL(/#state=/)

  const shareUrl = page.url()
  const sharedPage = await context.newPage()
  await sharedPage.goto(shareUrl)
  await sharedPage.getByRole('button', { name: /Open link/i }).click()
  await expect(
    sharedPage.getByLabel('Plan').getByRole('heading', { name: 'Call Mira about tickets' }),
  ).toBeVisible()

  await page.getByRole('button', { name: /Voice on/i }).click()
  await page.getByRole('button', { name: /Voice cue/i }).click()
  await expect(page.getByText(/Voice cues are off in Settings/)).toBeVisible()
})
