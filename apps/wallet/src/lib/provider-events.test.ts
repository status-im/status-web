// @vitest-environment happy-dom

import { Provider } from '@status-im/ethereum-provider'
import { beforeAll, expect, test, vi } from 'vitest'

/**
 * The page-facing half of the wallet-initiated event path: the bridge content
 * script re-posts what the service worker pushed, and the provider turns it
 * into an EIP-1193 event. Covered here because it is what lets an account
 * switch reach a dApp without a reload.
 */

const ACCOUNT = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

// happy-dom leaves `window.origin` undefined, which browsers define.
beforeAll(() => {
  Object.defineProperty(window, 'origin', { value: location.origin })
})

function postFromBridge(data: unknown, origin = window.origin) {
  // Dispatched rather than posted so the sending origin can be varied;
  // `postMessage`'s targetOrigin decides delivery, not `event.origin`.
  window.dispatchEvent(new MessageEvent('message', { data, origin }))
  return new Promise(resolve => setTimeout(resolve, 0))
}

test('a pushed account switch is emitted as accountsChanged', async () => {
  const provider = new Provider()
  const onAccountsChanged = vi.fn()
  provider.on('accountsChanged', onAccountsChanged)

  await postFromBridge({
    type: 'status:provider:event',
    event: 'accountsChanged',
    data: [ACCOUNT],
  })

  expect(onAccountsChanged).toHaveBeenCalledWith([ACCOUNT])
  expect(provider.connected).toBe(true)
})

test('an empty account list reads as disconnected', async () => {
  const provider = new Provider()
  const onAccountsChanged = vi.fn()
  provider.on('accountsChanged', onAccountsChanged)

  await postFromBridge({
    type: 'status:provider:event',
    event: 'accountsChanged',
    data: [],
  })

  expect(onAccountsChanged).toHaveBeenCalledWith([])
  expect(provider.connected).toBe(false)
})

test('unrelated page messages are ignored', async () => {
  const provider = new Provider()
  const onAccountsChanged = vi.fn()
  provider.on('accountsChanged', onAccountsChanged)

  await postFromBridge({ type: 'status:provider:event', event: 'chainChanged' })
  await postFromBridge({ type: 'some-other-library', data: [ACCOUNT] })

  expect(onAccountsChanged).not.toHaveBeenCalled()
})

test('a cross-origin frame cannot switch the account', async () => {
  const provider = new Provider()
  const onAccountsChanged = vi.fn()
  provider.on('accountsChanged', onAccountsChanged)

  await postFromBridge(
    {
      type: 'status:provider:event',
      event: 'accountsChanged',
      data: [ACCOUNT],
    },
    'https://evil.test',
  )

  expect(onAccountsChanged).not.toHaveBeenCalled()
})
