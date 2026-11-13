// @vitest-environment happy-dom

import { act } from 'react'

import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useActivationDelay } from './use-activation-delay'

import type { Root } from 'react-dom/client'

let container: HTMLDivElement
let root: Root
let isActive: boolean

function Probe({ enabled }: { enabled?: boolean }) {
  isActive = useActivationDelay(enabled, 500)
  return null
}

function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms)
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('useActivationDelay', () => {
  it('turns active only after the delay', () => {
    act(() => root.render(<Probe />))
    expect(isActive).toBe(false)
    advance(499)
    expect(isActive).toBe(false)
    advance(1)
    expect(isActive).toBe(true)
  })

  it('restarts when the window regains focus', () => {
    act(() => root.render(<Probe />))
    advance(500)
    expect(isActive).toBe(true)

    act(() => window.dispatchEvent(new Event('blur')))
    expect(isActive).toBe(false)
    act(() => window.dispatchEvent(new Event('focus')))
    advance(499)
    expect(isActive).toBe(false)
    advance(1)
    expect(isActive).toBe(true)
  })

  it('waits for enabled before starting', () => {
    act(() => root.render(<Probe enabled={false} />))
    advance(1000)
    expect(isActive).toBe(false)

    act(() => root.render(<Probe enabled />))
    advance(499)
    expect(isActive).toBe(false)
    advance(1)
    expect(isActive).toBe(true)
  })
})
