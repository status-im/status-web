import { act } from 'react'

import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { HardwareSignCancelledError } from '../hardware-sign-screen'
import { SendCollectiblesModal } from './index'

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
const GAS_FEES = {
  feeEth: 0.0001,
  feeEur: 0.3,
  maxFeeEth: 0.0002,
  maxFeeEur: 0.6,
  confirmationTime: '~12s',
  txParams: {
    gasLimit: '0x186a0',
    maxFeePerGas: '0x3b9aca00',
    maxPriorityFeePerGas: '0x5f5e100',
  },
}

let container: HTMLDivElement
let root: Root

const isDialogOpen = () => document.querySelector('[role="dialog"]') !== null

function render(props: { onSend: () => Promise<void> }) {
  act(() =>
    root.render(
      <SendCollectiblesModal
        standard="ERC721"
        displayName="Punk #1"
        fromAddress={FROM}
        accountName="Keystone"
        network="ethereum"
        contract="0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB"
        tokenId="1"
        gasFees={GAS_FEES}
        ethBalance={1}
        onEstimateGas={vi.fn()}
        hasActiveSession
        requestPassword={vi.fn(async () => true)}
        {...props}
      >
        <button type="button">Open</button>
      </SendCollectiblesModal>,
    ),
  )
}

function pressButton(label: string) {
  const button = [...document.querySelectorAll('button')].find(
    element => element.textContent === label,
  )
  if (!button) throw new Error(`No "${label}" button`)
  act(() => button.click())
}

function typeRecipient(address: string) {
  const input = document.querySelector<HTMLInputElement>(
    'input[placeholder="Address"]',
  )
  if (!input) throw new Error('No address input')
  const setValue = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )!.set!
  act(() => {
    setValue.call(input, address)
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

/** The press renders before `onSend` resumes, as the real build call's await allows. */
async function send() {
  pressButton('Open')
  typeRecipient(RECIPIENT)
  pressButton('Sign transaction')
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0))
  })
}

/** An `onSend` that records whether the dialog was still open once it ran. */
function recordDialogDuringSend() {
  const seen: { open?: boolean } = {}
  const onSend = async () => {
    await Promise.resolve()
    seen.open = isDialogOpen()
  }
  return { seen, onSend }
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

describe('SendCollectiblesModal', () => {
  // The signing overlay stacks above the dialog, so it can stay open.
  it('stays open while signing', async () => {
    const { seen, onSend } = recordDialogDuringSend()
    render({ onSend })

    await send()

    expect(seen.open).toBe(true)
    expect(toast.positive).toHaveBeenCalledWith('NFT transfer submitted')
  })

  it('stays open and says nothing when the user cancels on the hardware wallet', async () => {
    render({
      onSend: async () => {
        throw new HardwareSignCancelledError()
      },
    })

    await send()

    expect(isDialogOpen()).toBe(true)
    expect(toast.negative).not.toHaveBeenCalled()
    expect(toast.positive).not.toHaveBeenCalled()
  })

  it('reports any other failure', async () => {
    render({
      onSend: async () => {
        throw new Error('execution reverted')
      },
    })

    await send()

    expect(toast.negative).toHaveBeenCalledWith(
      'The NFT contract rejected this transfer.',
    )
  })
})
