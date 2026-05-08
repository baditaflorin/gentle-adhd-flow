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
