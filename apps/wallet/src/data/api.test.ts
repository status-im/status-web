import { storage } from '@wxt-dev/storage'
import { getAddress } from 'viem'
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
    alarms: {
      create: vi.fn(),
      clear: vi.fn(),
    },
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

beforeEach(async () => {
  vi.stubGlobal('chrome', createChromeMock())
  // Keep account discovery during wallet import off the network; it falls
  // back to importing account 0 only.
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      throw new Error('network disabled in tests')
    }),
  )
  await storage.clear('local')
  await storage.clear('session')
  // vi.stubGlobal('browser', createChromeMock())
  // globalThis.chrome = createChromeMock()
  // globalThis.browser = createChromeMock()
  // fakeBrowser.reset()
})

afterEach(async () => {
  await storage.clear('local')
  await storage.clear('session')
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
}, 7000)

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
}, 7000)

test('should discover active accounts when importing a wallet', async () => {
  // Addresses at m/44'/60'/0'/0/{0,1} of the mnemonic below
  const firstAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  const activeAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

  // Emulates the JSON-RPC rpc.proxy endpoint: only activeAddress has
  // transactions
  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: unknown, init?: RequestInit) => {
      const body = JSON.parse(init?.body as string)
      const isActive =
        body.method === 'eth_getTransactionCount' &&
        body.params[0] === activeAddress
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: body.id,
          result: isActive ? '0x1' : '0x0',
        }),
      )
    }),
  )

  await createAPI()
  const apiClient = createAPIClient()

  const importedWallet = await apiClient.wallet.import.mutate({
    mnemonic: 'test test test test test test test test test test test junk',
    password: 'password',
  })

  const accounts = await apiClient.wallet.account.all.query({
    walletId: importedWallet.id,
  })

  expect(accounts.map(a => a.address)).toEqual([firstAddress, activeAddress])
  expect(accounts.map(a => a.derivationPath)).toEqual([
    "m/44'/60'/0'/0/0",
    "m/44'/60'/0'/0/1",
  ])
}, 15000)

test('should import wallet with explicit derivation paths', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  const importedWallet = await apiClient.wallet.import.mutate({
    mnemonic: 'test test test test test test test test test test test junk',
    password: 'password',
    derivationPaths: ["m/44'/60'/0'/0/0", "m/44'/60'/0'/0/5"],
  })

  const accounts = await apiClient.wallet.account.all.query({
    walletId: importedWallet.id,
  })

  expect(accounts.map(a => a.address)).toEqual([
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
  ])
  expect(accounts.map(a => a.derivationPath)).toEqual([
    "m/44'/60'/0'/0/0",
    "m/44'/60'/0'/0/5",
  ])
}, 15000)

test('should preview an account at a custom derivation path', async () => {
  const activeAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: unknown, init?: RequestInit) => {
      const body = JSON.parse(init?.body as string)
      const isActive =
        body.method === 'eth_getTransactionCount' &&
        body.params[0] === activeAddress
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: body.id,
          result: isActive ? '0x1' : '0x0',
        }),
      )
    }),
  )

  await createAPI()
  const apiClient = createAPIClient()
  const mnemonic = 'test test test test test test test test test test test junk'

  const active = await apiClient.wallet.previewAccount.mutate({
    mnemonic,
    derivationPath: "m/44'/60'/0'/0/1",
  })
  const inactive = await apiClient.wallet.previewAccount.mutate({
    mnemonic,
    derivationPath: "m/44'/60'/0'/0/2",
  })

  expect(active).toMatchObject({ address: activeAddress, active: true })
  expect(inactive).toMatchObject({
    address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    active: false,
  })
}, 15000)

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
  })

  expect(returnedWallet.mnemonic).toBe(mnemonic)
}, 7000)

test('should import hardware wallet metadata', async () => {
  await createAPI()
  const apiClient = createAPIClient()
  const normalizedAddress = getAddress(
    '0x1234567890abcdef1234567890abcdef12345678',
  )

  const importedWallet = await apiClient.wallet.importHardware.mutate({
    name: 'Keystone Wallet',
    vendor: 'Keystone',
    password: 'hardware-password',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    derivationPath: "m/44'/60'/0'/0/7",
    publicKey: 'xpub661MyMwAqRbcF7FakePublicKey',
    sourceFingerprint: 1234,
  })

  const wallets = await apiClient.wallet.all.query()

  expect(importedWallet.address).toBe(normalizedAddress)
  expect(importedWallet.name).toBe('Keystone Wallet')
  await apiClient.session.lock.mutate()
  await expect(
    apiClient.session.unlock.mutate({ password: 'hardware-password' }),
  ).resolves.toEqual({ unlocked: true })
  expect(wallets).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        id: importedWallet.id,
        name: 'Keystone Wallet',
        type: 'hardware-qr',
        accounts: expect.arrayContaining([
          expect.objectContaining({
            address: normalizedAddress,
            derivationPath: "m/44'/60'/0'/0/7",
          }),
        ]),
        selectedAccountAddress: normalizedAddress,
        hardware: expect.objectContaining({
          vendor: 'Keystone',
          publicKey: 'xpub661MyMwAqRbcF7FakePublicKey',
          sourceFingerprint: 1234,
        }),
      }),
    ]),
  )
}, 7000)

test('should reject invalid hardware wallet metadata', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  await expect(
    apiClient.wallet.importHardware.mutate({
      name: 'Keystone Wallet',
      vendor: 'Keystone',
      address: 'not-an-address',
      derivationPath: 'not-a-path',
      publicKey: 'fake public key with spaces',
      sourceFingerprint: -1,
    }),
  ).rejects.toThrow()
}, 7000)

test('should require a password when importing the first hardware wallet', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  await expect(
    apiClient.wallet.importHardware.mutate({
      name: 'Keystone Wallet',
      vendor: 'Keystone',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      derivationPath: "m/44'/60'/0'/0/7",
      publicKey: 'xpub661MyMwAqRbcF7FakePublicKey',
    }),
  ).rejects.toThrow()
}, 7000)

test('should add the next sequential account to a wallet', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  const importedWallet = await apiClient.wallet.import.mutate({
    mnemonic: 'test test test test test test test test test test test junk',
    password: 'password',
    derivationPaths: ["m/44'/60'/0'/0/0"],
  })

  const account = await apiClient.wallet.account.ethereum.add.mutate({
    walletId: importedWallet.id,
  })

  expect(account).toMatchObject({
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    derivationPath: "m/44'/60'/0'/0/1",
  })

  const wallets = await apiClient.wallet.all.query()
  const wallet = wallets.find(w => w.id === importedWallet.id)
  expect(wallet?.accounts).toHaveLength(2)
  expect(wallet?.selectedAccountAddress).toBe(account.address)
}, 15000)

test('should add an account at a custom derivation path', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  const importedWallet = await apiClient.wallet.import.mutate({
    mnemonic: 'test test test test test test test test test test test junk',
    password: 'password',
    derivationPaths: ["m/44'/60'/0'/0/0"],
  })

  const custom = await apiClient.wallet.account.ethereum.add.mutate({
    walletId: importedWallet.id,
    derivationPath: "m/44'/60'/0'/0/5",
  })
  expect(custom.address).toBe('0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc')

  // The next sequential account continues after the highest imported index
  const next = await apiClient.wallet.account.ethereum.add.mutate({
    walletId: importedWallet.id,
  })
  expect(next.derivationPath).toBe("m/44'/60'/0'/0/6")
}, 15000)

test('should reject adding an already imported account', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  const importedWallet = await apiClient.wallet.import.mutate({
    mnemonic: 'test test test test test test test test test test test junk',
    password: 'password',
    derivationPaths: ["m/44'/60'/0'/0/0"],
  })

  await expect(
    apiClient.wallet.account.ethereum.add.mutate({
      walletId: importedWallet.id,
      derivationPath: "m/44'/60'/0'/0/0",
    }),
  ).rejects.toThrow(/ACCOUNT_ALREADY_EXISTS/)

  await expect(
    apiClient.wallet.account.ethereum.add.mutate({
      walletId: importedWallet.id,
      derivationPath: 'not-a-path',
    }),
  ).rejects.toThrow()

  const accounts = await apiClient.wallet.account.all.query({
    walletId: importedWallet.id,
  })
  expect(accounts).toHaveLength(1)
}, 15000)

test('should reject adding an account to a non-mnemonic wallet', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  const importedWallet = await apiClient.wallet.importHardware.mutate({
    name: 'Keystone Wallet',
    vendor: 'Keystone',
    password: 'hardware-password',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    derivationPath: "m/44'/60'/0'/0/7",
    publicKey: 'xpub661MyMwAqRbcF7FakePublicKey',
  })

  await expect(
    apiClient.wallet.account.ethereum.add.mutate({
      walletId: importedWallet.id,
    }),
  ).rejects.toThrow(/WALLET_CANNOT_DERIVE/)
}, 7000)

test('should reject adding an account when the session is locked', async () => {
  await createAPI()
  const apiClient = createAPIClient()

  const importedWallet = await apiClient.wallet.import.mutate({
    mnemonic: 'test test test test test test test test test test test junk',
    password: 'password',
    derivationPaths: ["m/44'/60'/0'/0/0"],
  })

  await apiClient.session.lock.mutate()

  await expect(
    apiClient.wallet.account.ethereum.add.mutate({
      walletId: importedWallet.id,
    }),
  ).rejects.toThrow()
}, 15000)

test('should preview an account of an existing wallet', async () => {
  const activeAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

  vi.stubGlobal(
    'fetch',
    vi.fn(async (_url: unknown, init?: RequestInit) => {
      const body = JSON.parse(init?.body as string)
      const isActive =
        body.method === 'eth_getTransactionCount' &&
        body.params[0] === activeAddress
      return new Response(
        JSON.stringify({
          jsonrpc: '2.0',
          id: body.id,
          result: isActive ? '0x1' : '0x0',
        }),
      )
    }),
  )

  await createAPI()
  const apiClient = createAPIClient()

  const importedWallet = await apiClient.wallet.import.mutate({
    mnemonic: 'test test test test test test test test test test test junk',
    password: 'password',
    derivationPaths: ["m/44'/60'/0'/0/0"],
  })

  // Without a path, previews the next sequential account
  const next = await apiClient.wallet.account.ethereum.preview.mutate({
    walletId: importedWallet.id,
  })
  expect(next).toMatchObject({
    address: activeAddress,
    derivationPath: "m/44'/60'/0'/0/1",
    active: true,
    alreadyImported: false,
  })

  const imported = await apiClient.wallet.account.ethereum.preview.mutate({
    walletId: importedWallet.id,
    derivationPath: "m/44'/60'/0'/0/0",
  })
  expect(imported.alreadyImported).toBe(true)

  // Preview does not persist anything
  const accounts = await apiClient.wallet.account.all.query({
    walletId: importedWallet.id,
  })
  expect(accounts).toHaveLength(1)
}, 15000)
