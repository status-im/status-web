import { expect, test } from '@fixtures/wallet/wallet-extension.fixture.js'

import type { Page } from '@playwright/test'

const ORIGIN = `https://${'trusted.'.repeat(20)}attacker.example`

test(
  'shows the actual site origin in connection and signing approvals',
  {
    tag: '@wallet-send',
  },
  async ({ walletContext, walletPage }, testInfo) => {
    // walletPage completes onboarding before the dapp starts making requests.
    await expect(walletPage).toHaveURL(/\/portfolio\/assets/)
    await walletPage.evaluate(async () => {
      const browser = Reflect.get(globalThis, 'chrome')
      const currentWindow = await browser.windows.getCurrent()
      await browser.windows.update(currentWindow.id!, {
        left: 0,
        top: 0,
        width: 1000,
        height: 800,
      })
    })

    const dapp = await walletContext.newPage()
    await dapp.route(`${ORIGIN}/**`, route =>
      route.fulfill({
        contentType: 'text/html',
        body: `<!doctype html>
        <title>Trusted Wallet</title>
        <button id="connect">Connect</button>
        <button id="sign">Sign</button>
        <output id="result"></output>
        <script>
          const result = document.querySelector('#result')
          document.querySelector('#connect').onclick = async () => {
            try {
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
              result.textContent = 'connected:' + accounts[0]
            } catch (error) {
              result.textContent = 'error:' + error.code
            }
          }
          document.querySelector('#sign').onclick = async () => {
            try {
              const [account] = await window.ethereum.request({ method: 'eth_accounts' })
              await window.ethereum.request({
                method: 'personal_sign',
                params: ['0x68656c6c6f', account],
              })
              result.textContent = 'signed'
            } catch (error) {
              result.textContent = 'error:' + error.code
            }
          }
        </script>`,
      }),
    )
    await dapp.goto(ORIGIN)
    await expect
      .poll(() =>
        dapp.evaluate(() => typeof Reflect.get(window, 'ethereum')?.request),
      )
      .toBe('function')

    const connectionPopupPromise = walletContext.waitForEvent('page')
    await dapp.getByRole('button', { name: 'Connect' }).click()
    const connectionPopup = await connectionPopupPromise
    await connectionPopup.setViewportSize({ width: 390, height: 628 })
    await expect(
      connectionPopup.getByRole('heading', { name: 'Connect dApp' }),
    ).toBeVisible()
    await assertSiteIdentity(connectionPopup)
    await testInfo.attach('connection-approval', {
      body: await connectionPopup.screenshot(),
      contentType: 'image/png',
    })
    await connectionPopup.getByRole('button', { name: 'Connect' }).click()
    await expect(dapp.locator('#result')).toContainText(/^connected:0x/)

    const signingPopupPromise = walletContext.waitForEvent('page')
    await dapp.getByRole('button', { name: 'Sign' }).click()
    const signingPopup = await signingPopupPromise
    await signingPopup.setViewportSize({ width: 390, height: 628 })
    await expect(
      signingPopup.getByRole('heading', { name: 'Sign message' }),
    ).toBeVisible()
    await assertSiteIdentity(signingPopup)
    await testInfo.attach('signing-approval', {
      body: await signingPopup.screenshot(),
      contentType: 'image/png',
    })
    await signingPopup.getByRole('button', { name: 'Decline' }).click()
    await expect(dapp.locator('#result')).toHaveText('error:4001')
  },
)

async function assertSiteIdentity(popup: Page) {
  const origin = popup.getByText(ORIGIN, { exact: true })
  const siteName = popup.getByText(
    'Site name (provided by site): Trusted Wallet',
  )

  await expect(origin).toBeVisible()
  await expect(siteName).toBeVisible()
  await expect(origin).not.toHaveClass(/truncate/)
  await expect(popup.getByRole('button', { name: 'Decline' })).toBeVisible()

  const fullyRendered = await origin.evaluate(
    element => element.scrollHeight === element.clientHeight,
  )
  expect(fullyRendered).toBe(true)

  const bounds = await origin.evaluate(element => {
    const rect = element.getBoundingClientRect()
    return { top: rect.top, bottom: rect.bottom, viewportHeight: innerHeight }
  })
  expect(bounds.top).toBeGreaterThanOrEqual(0)
  expect(bounds.bottom).toBeLessThanOrEqual(bounds.viewportHeight)

  const unobscured = await origin.evaluate(element => {
    const rect = element.getBoundingClientRect()
    const atCenter = document.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    )
    return atCenter === element || element.contains(atCenter)
  })
  expect(unobscured).toBe(true)
}
