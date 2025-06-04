import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { createAPI, createAPIClient } from './api'

type OnMessageListener = (message: unknown) => void
type OnConnectListener = (port: unknown) => void

// @see https://github.com/jlalmes/trpc-chrome/blob/af6cc54c66b652fee90be39b837b1b7ff8269cb5/test/__setup.ts
const createChromeMock = () => {
  const linkPortOnMessageListeners: OnMessageListener[] = []
  const handlerPortOnMessageListeners: OnMessageListener[] = []
  const handlerPortOnConnectListeners: OnConnectListener[] = []

  return {
    runtime: {
      connect: vi.fn(() => {
        const handlerPort = {
          postMessage: vi.fn(message => {
            linkPortOnMessageListeners.forEach(listener => listener(message))
          }),
          onMessage: {
            addListener: vi.fn(listener => {
              handlerPortOnMessageListeners.push(listener)
            }),
            removeListener: vi.fn(),
          },
          onDisconnect: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
          },
        }

        const linkPort = {
          postMessage: vi.fn(message => {
            handlerPortOnMessageListeners.forEach(listener => listener(message))
          }),
          onMessage: {
            addListener: vi.fn(listener => {
              linkPortOnMessageListeners.push(listener)
            }),
            removeListener: vi.fn(),
          },
          onDisconnect: {
            addListener: vi.fn(),
            removeListener: vi.fn(),
          },
        }

        handlerPortOnConnectListeners.forEach(listener => listener(handlerPort))

        return linkPort
      }),
      onConnect: {
        addListener: vi.fn(listener => {
          handlerPortOnConnectListeners.push(listener)
        }),
      },
    },
  }
}

beforeEach(() => {
  vi.stubGlobal('chrome', createChromeMock())
  // vi.stubGlobal('browser', createChromeMock())
  // globalThis.chrome = createChromeMock()
  // globalThis.browser = createChromeMock()
  // fakeBrowser.reset()
})

afterEach(async () => {
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

test('should add wallet', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  const addedWallet = await apiClient.wallet.add.mutate({
    password: 'password',
    name: 'Untitled',
  })

  expect(addedWallet.mnemonic).toBeDefined()
}, 6000)

test('should import wallet', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  const mnemonic = 'test test test test test test test test test test test junk'
  const password = 'password'

  const importedWallet = await apiClient.wallet.import.mutate({
    mnemonic,
    password,
    name: 'Untitled',
  })

  expect(importedWallet.mnemonic).toBe(mnemonic)
}, 6000)

test('should get wallet', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  const mnemonic = 'test test test test test test test test test test test junk'
  const password = 'password'

  const importedWallet = await apiClient.wallet.import.mutate({
    mnemonic,
    password,
    name: 'Untitled',
  })

  const returnedWallet = await apiClient.wallet.get.query({
    walletId: importedWallet.id,
    password,
  })

  expect(returnedWallet.mnemonic).toBe(mnemonic)
}, 6000)
