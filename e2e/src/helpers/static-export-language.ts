import { expect, type Page } from '@playwright/test'

export function languageSelector(page: Page) {
  return page.getByRole('combobox').last()
}

export async function switchLanguage(page: Page, locale: 'en' | 'ko') {
  const selector = languageSelector(page)
  await selector.click()

  const option =
    locale === 'en'
      ? page.getByRole('option', { name: /english \(en\)/i })
      : page.getByRole('option', { name: /korean \(ko\)/i })

  await expect(option).toBeVisible()
  await option.click()
}
