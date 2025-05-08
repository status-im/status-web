import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import { createAPI, createAPIClient } from './api'

type OnMessageListener = (message: unknown) => void
type OnConnectListener = (port: unknown) => void

// @see https://github.com/jlalmes/trpc-chrome/blob/af6cc54c66b652fee90be39b837b1b7ff8269cb5/test/__setup.ts
const chrome = vi.fn(() => {
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
})()

// globalThis.chrome = chrome

beforeEach(() => {
  vi.stubGlobal('chrome', chrome)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

test('should import wallet', async () => {
  await createAPI()
  const client = createAPIClient()

  const mnemonic = 'test test test test test test test test test test test junk'
  const password = 'password'

  const result = await client.wallet.import.mutate({
    mnemonic,
    password,
    name: 'Untitled',
  })

  expect(result.mnemonic).toBe(mnemonic)
  // todo: spy storage
})
