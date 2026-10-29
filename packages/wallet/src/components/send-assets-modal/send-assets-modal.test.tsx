import { act } from 'react'

import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GasShiftedError } from '../../constants/errors'
import { HardwareSignCancelledError } from '../hardware-sign-screen'
import { SendAssetsModal } from './index'

import type { Root } from 'react-dom/client'

const toast = vi.hoisted(() => ({
  positive: vi.fn(),
  negative: vi.fn(),
}))

vi.mock(import('@status-im/components'), async importOriginal => ({
  ...(await importOriginal()),
  useToast: () => toast as never,
}))

const FROM = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const RECIPIENT = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

let container: HTMLDivElement
let root: Root

const isDialogOpen = () => document.querySelector('[role="dialog"]') !== null

function render(signTransaction: () => Promise<string>) {
  act(() =>
    root.render(
      <SendAssetsModal
        account={{
          name: 'Keycard',
          emoji: '🍑',
          color: 'blue',
          address: FROM,
          ethBalance: 1,
        }}
        asset={{
          name: 'Ether',
          symbol: 'ETH',
          totalBalance: 1,
          totalBalanceEur: 3000,
          network: 'ethereum',
          decimals: 18,
        }}
        signTransaction={signTransaction}
        onEstimateGas={vi.fn()}
        hasActiveSession
        requestPassword={vi.fn(async () => true)}
        gasFees={{
          maxFeeEur: 0.6,
          feeEur: 0.3,
          maxFeeEth: 0.0002,
          confirmationTime: '~12s',
          feeEth: 0.0001,
        }}
      >
        <button type="button">Open</button>
      </SendAssetsModal>,
    ),
  )
}

function input(placeholder: string) {
  const element = document.querySelector<HTMLInputElement>(
    `input[placeholder="${placeholder}"]`,
  )
  if (!element) throw new Error(`No "${placeholder}" input`)
  return element
}

function type(placeholder: string, value: string) {
  const element = input(placeholder)
  const setValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )!.set!
  act(() => {
    setValue.call(element, value)
    element.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

function submitButton() {
  return document.querySelector<HTMLButtonElement>('button[type="submit"]')
}

function pressButton(label: string) {
  const button = [...document.querySelectorAll('button')].find(
    element => element.textContent === label,
  )
  if (!button) throw new Error(`No "${label}" button`)
  act(() => button.click())
}

/** Opens the dialog, fills it in and sends, letting validation and signing settle. */
async function send() {
  pressButton('Open')
  type('Address', RECIPIENT)
  type('0', '0.1')
  await act(async () => {
    submitButton()!.click()
    await new Promise(resolve => setTimeout(resolve, 0))
  })
}

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.clearAllMocks()
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

describe('SendAssetsModal', () => {
  it('closes after a successful send', async () => {
    const signTransaction = vi.fn(async () => `0x${'ab'.repeat(32)}`)
    render(signTransaction)

    await send()

    expect(signTransaction).toHaveBeenCalled()
    expect(isDialogOpen()).toBe(false)
    expect(toast.positive).toHaveBeenCalled()
  })

  it('returns to the filled-in form when the user cancels on the hardware wallet', async () => {
    render(async () => {
      throw new HardwareSignCancelledError()
    })

    await send()

    expect(isDialogOpen()).toBe(true)
    expect(input('Address').value).toBe(RECIPIENT)
    expect(submitButton()?.textContent).toBe('Send transaction')
    expect(toast.positive).not.toHaveBeenCalled()
    expect(toast.negative).not.toHaveBeenCalled()
  })

  it('stays open to confirm a gas price change', async () => {
    render(async () => {
      throw new GasShiftedError()
    })

    await send()

    expect(isDialogOpen()).toBe(true)
    expect(submitButton()?.textContent).toBe('Confirm with new gas price')
  })
})
