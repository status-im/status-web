import { expect, test } from '@playwright/test'

import {
  languageSelector,
  switchLanguage,
} from '../../src/helpers/static-export-language'

test.describe('status.network static export', () => {
  test(
    'legal pages render from the exported build',
    { tag: '@status-network-static' },
    async ({ page }) => {
      await test.step('Terms of Use', async () => {
        const response = await page.goto('/legal/terms-of-use')
        expect(response?.status()).toBe(200)
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: /status network - website terms of use/i,
          }),
        ).toBeVisible()
        await expect(page.getByText(/who we are/i)).toBeVisible()
      })

      await test.step('Privacy Policy', async () => {
        const response = await page.goto('/legal/privacy-policy')
        expect(response?.status()).toBe(200)
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: /status network - website privacy policy/i,
          }),
        ).toBeVisible()
      })

      await test.step('Footer legal links resolve', async () => {
        await page.goto('/')
        await page.getByRole('link', { name: /^terms of use$/i }).click()
        await expect(page).toHaveURL(/\/legal\/terms-of-use\/?$/)
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: /status network - website terms of use/i,
          }),
        ).toBeVisible()
      })
    },
  )

  test(
    'brand page renders from the exported build',
    { tag: '@status-network-static' },
    async ({ page }) => {
      const response = await page.goto('/brand')
      expect(response?.status()).toBe(200)

      await expect(
        page.getByRole('heading', { level: 1, name: /brand assets/i }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: /^get started$/i }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: /^blog$/i }).first(),
      ).toBeVisible()
    },
  )

  test(
    'unknown routes show the not-found page',
    { tag: '@status-network-static' },
    async ({ page }) => {
      const response = await page.goto('/this-route-does-not-exist')
      expect(response?.status()).toBe(404)

      await expect(
        page.getByRole('heading', {
          name: /this is not the page you're looking for/i,
        }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: /take me home/i }),
      ).toBeVisible()

      await page.getByRole('link', { name: /take me home/i }).click()
      await expect(page).toHaveURL(/\/$/)
    },
  )

  test(
    'language switching works on legal and brand pages after static export',
    { tag: '@status-network-static' },
    async ({ page }) => {
      await test.step('Korean legal route loads directly', async () => {
        const response = await page.goto('/ko/legal/privacy-policy')
        expect(response?.status()).toBe(200)
        await expect(languageSelector(page)).toContainText('KO')
        await expect(
          page.getByRole('link', { name: /개인정보 보호정책/i }),
        ).toBeVisible()
      })

      await test.step('Switch Korean legal page back to English', async () => {
        await switchLanguage(page, 'en')
        await expect(page).toHaveURL(/\/legal\/privacy-policy\/?$/)
        await expect(languageSelector(page)).toContainText('EN')
      })

      await test.step('Switch English brand page to Korean', async () => {
        await page.goto('/brand')
        await switchLanguage(page, 'ko')
        await expect(page).toHaveURL(/\/ko\/brand\/?$/)
        await expect(
          page.getByRole('heading', { level: 1, name: /브랜드 자산/i }),
        ).toBeVisible()
        await expect(page.getByRole('link', { name: /^소개$/i })).toBeVisible()
      })

      await test.step('Re-select English stays on brand page', async () => {
        await switchLanguage(page, 'en')
        await expect(page).toHaveURL(/\/brand\/?$/)
        await expect(
          page.getByRole('heading', { level: 1, name: /brand assets/i }),
        ).toBeVisible()
      })
    },
  )
})
