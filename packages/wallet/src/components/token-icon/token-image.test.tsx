import { act } from 'react'

import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ActivityTokenLogo } from '../activity-list/components/activity-token-logo'
import { TokenLogo } from '../token-logo'
import { TokenIcon } from './index'
import { TokenImage } from './token-image'

import type { ReactNode } from 'react'
import type { Root } from 'react-dom/client'

const uni = 'ipfs://QmXttGpZrECX5qCyXbBQiqgQNytVGeZW5Anewvh2jc4psg'
const uniHttps = 'https://ethereum-optimism.github.io/data/UNI/logo.png'
let container: HTMLDivElement
let root: Root

beforeEach(() => {
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
})

function render(node: ReactNode) {
  act(() => root.render(node))
}

describe('token image loading', () => {
  it.each([
    ['list', <TokenIcon icon={uni} name="Uniswap" symbol="UNI" size="24" />],
    ['detail', <TokenLogo icon={uni} name="Uniswap" ticker="UNI" />],
    [
      'activity',
      <ActivityTokenLogo
        symbol="UNI"
        address="0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
      />,
    ],
  ])(
    'uses HTTPS for UNI and handles a failed image in the %s',
    (_, component) => {
      render(component)
      const image = container.querySelector('img')!
      expect(image.getAttribute('src')).toBe(uniHttps)
      act(() => image.dispatchEvent(new Event('error')))
      expect(container.querySelector('img')).toBeNull()
      expect(container.textContent).toContain('U')
    },
  )

  it('retries when the URL changes, including returning to an earlier URL', () => {
    const icon = (src?: string) => (
      <TokenImage
        src={src}
        alt="Token"
        className="size-6"
        fallback={<span>Fallback</span>}
      />
    )
    render(icon('https://example.com/first.png'))
    act(() => container.querySelector('img')!.dispatchEvent(new Event('error')))
    expect(container.textContent).toBe('Fallback')
    render(icon('https://example.com/second.png'))
    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      'https://example.com/second.png',
    )
    render(icon('https://example.com/first.png'))
    expect(container.querySelector('img')).not.toBeNull()
    render(icon())
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toBe('Fallback')
  })

  it('does not replace unrelated tokens that share the UNI symbol', () => {
    render(
      <TokenIcon
        icon="https://example.com/other.png"
        name="Other"
        symbol="UNI"
        size="24"
      />,
    )
    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      'https://example.com/other.png',
    )
  })

  it('uses the contract address when activity tokens share a symbol', () => {
    render(
      <ActivityTokenLogo
        symbol="UNI"
        address="0xe6877ea9c28fbdec631ffbc087956d0023a76bf2"
      />,
    )
    expect(container.querySelector('img')?.getAttribute('src')).toBe(
      'https://s2.coinmarketcap.com/static/img/coins/64x64/4113.png',
    )
  })

  it.each(['UNI', 'ETH'])(
    'does not use the %s symbol to identify an unknown contract',
    symbol => {
      render(
        <ActivityTokenLogo
          symbol={symbol}
          address="0x0000000000000000000000000000000000000001"
        />,
      )
      expect(container.querySelector('img')).toBeNull()
      expect(container.textContent).toBe(symbol)
    },
  )

  it.each([
    ['UNI', uniHttps],
    ['ETH', 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'],
  ])(
    'keeps symbol lookup for %s activity without a contract',
    (symbol, src) => {
      render(<ActivityTokenLogo symbol={symbol} address="" />)
      expect(container.querySelector('img')?.getAttribute('src')).toBe(src)
    },
  )

  it.each([
    [
      'list',
      <TokenIcon icon={uni} name="Uniswap" symbol="UNI" size="24" />,
      'Uniswap',
    ],
    ['activity', <ActivityTokenLogo symbol="UNI" address="" />, 'UNI'],
  ])(
    'preserves the accessible name after an image fails in the %s',
    (_, component, name) => {
      render(component)
      act(() =>
        container.querySelector('img')!.dispatchEvent(new Event('error')),
      )
      expect(
        container.querySelector('[role="img"]')?.getAttribute('aria-label'),
      ).toBe(name)
    },
  )

  it('retries when a new source resolves to the same image URL', () => {
    const icon = (src: string) => (
      <TokenImage
        src={src}
        alt="Uniswap"
        className="size-6"
        fallback={<span>Fallback</span>}
      />
    )
    render(icon(uni))
    act(() => container.querySelector('img')!.dispatchEvent(new Event('error')))
    expect(container.textContent).toBe('Fallback')
    render(icon(uniHttps))
    expect(container.querySelector('img')?.getAttribute('src')).toBe(uniHttps)
  })

  it('shows the existing initial when an icon is missing', () => {
    render(<TokenIcon name="Agave" symbol="AGVE" size="24" />)
    expect(container.querySelector('img')).toBeNull()
    expect(container.textContent).toBe('A')
  })
})
