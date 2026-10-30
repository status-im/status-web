// @vitest-environment happy-dom

import { act } from 'react'

import { createRoot } from 'react-dom/client'
import { hexToBytes } from 'viem'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApprovalPage } from './approval-page'

import type { PendingApproval } from '../../data/approval'
import type { Root } from 'react-dom/client'

const mocks = vi.hoisted(() => ({
  screen: null as null | {
    request: unknown
    address: string
    sourceFingerprint: number | undefined
    derivationPath: string | undefined
    origin: string
    onSignature: (signature: string) => void
    onCancel: () => void
  },
  passwordOpen: false,
  sessionStatus: vi.fn(),
  connectAccount: vi.fn(),
}))

vi.mock('@status-im/wallet/components', () => ({
  HardwareSignScreen: (props: NonNullable<typeof mocks.screen>) => {
    mocks.screen = props
    return null
  },
  PasswordModal: ({ open }: { open: boolean }) => {
    mocks.passwordOpen = open
    return null
  },
}))

vi.mock('../../providers/api-client', () => ({
  apiClient: {
    session: {
      status: { query: mocks.sessionStatus },
      unlock: { mutate: vi.fn() },
    },
  },
}))

vi.mock('../../data/dapp-permissions', () => ({
  connectAccount: mocks.connectAccount,
}))

const ORIGIN = 'https://app.velora.xyz'
const ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const PATH = "m/44'/60'/0'/0/1"
const UNSIGNED_TX = '0x02c90180808080808080c0'

const HARDWARE = {
  walletType: 'hardware-qr',
  sourceFingerprint: 0x12345678,
  derivationPath: PATH,
} as const

let container: HTMLDivElement
let root: Root
let session: Map<string, unknown>
let close: ReturnType<typeof vi.spyOn>

function approval(fields: Record<string, unknown>) {
  return {
    id: 'approval-1',
    createdAt: Date.now(),
    origin: ORIGIN,
    title: 'Velora',
    favicon: `${ORIGIN}/favicon.ico`,
    address: ADDRESS,
    accountName: 'Keycard',
    chainId: '0x1',
    ...fields,
  } as PendingApproval
}

async function settle() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
  })
}

async function open(pending: PendingApproval) {
  session.set('pendingApproval', pending)
  act(() => root.render(<ApprovalPage />))
  await settle()
}

async function pressButton(label: string) {
  const button = [...document.querySelectorAll('button')].find(
    element => element.textContent === label,
  )
  if (!button) throw new Error(`No "${label}" button`)
  act(() => button.click())
  await settle()
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.clearAllMocks()
  mocks.screen = null
  mocks.passwordOpen = false
  mocks.sessionStatus.mockResolvedValue({ isUnlocked: false })
  session = new Map()
  vi.stubGlobal('chrome', {
    storage: {
      session: {
        get: async (key: string) =>
          session.has(key) ? { [key]: session.get(key) } : {},
        set: async (items: Record<string, unknown>) => {
          for (const [k, v] of Object.entries(items)) session.set(k, v)
        },
        remove: async (key: string) => {
          session.delete(key)
        },
      },
    },
  })
  close = vi.spyOn(window, 'close').mockImplementation(() => {})
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  close.mockRestore()
  vi.unstubAllGlobals()
})

describe('hardware wallets', () => {
  it('signs a message on the device without a password', async () => {
    await open(
      approval({ type: 'personal_sign', message: 'hello', ...HARDWARE }),
    )
    expect(mocks.passwordOpen).toBe(false)

    await pressButton('Sign')

    expect(mocks.screen).toMatchObject({
      request: {
        kind: 'personalMessage',
        message: new TextEncoder().encode('hello'),
      },
      address: ADDRESS,
      sourceFingerprint: 0x12345678,
      derivationPath: PATH,
      origin: ORIGIN,
    })

    await act(async () => mocks.screen!.onSignature('0xsig'))

    expect(session.get('approvalResult')).toEqual({
      id: 'approval-1',
      approved: true,
      signature: '0xsig',
    })
    expect(close).toHaveBeenCalled()
  })

  it('hands the device the unsigned transaction', async () => {
    await open(
      approval({
        type: 'eth_sendTransaction',
        to: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        value: '0x1',
        data: null,
        maxFeeEth: '0.000021',
        serializedUnsignedTx: UNSIGNED_TX,
        ...HARDWARE,
      }),
    )

    await pressButton('Confirm')

    expect(mocks.screen?.request).toEqual({
      kind: 'transaction',
      serializedTx: hexToBytes(UNSIGNED_TX),
      chainId: 1,
    })
  })

  it('declines the request when the user cancels on the device', async () => {
    await open(
      approval({ type: 'personal_sign', message: 'hello', ...HARDWARE }),
    )
    await pressButton('Sign')

    await act(async () => mocks.screen!.onCancel())

    expect(session.get('approvalResult')).toEqual({
      id: 'approval-1',
      approved: false,
    })
    expect(close).toHaveBeenCalled()
  })

  it('connects without a password or the device', async () => {
    await open(
      approval({ type: 'eth_requestAccounts', walletType: 'hardware-qr' }),
    )
    expect(mocks.passwordOpen).toBe(false)

    await pressButton('Connect')

    expect(mocks.screen).toBeNull()
    expect(mocks.connectAccount).toHaveBeenCalledWith(ORIGIN, ADDRESS)
    expect(session.get('approvalResult')).toEqual({
      id: 'approval-1',
      approved: true,
    })
  })
})

it('asks a locked software wallet for the password', async () => {
  await open(
    approval({
      type: 'personal_sign',
      message: 'hello',
      walletType: 'mnemonic',
    }),
  )

  expect(mocks.passwordOpen).toBe(true)
})
