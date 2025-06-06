import { vi } from 'vitest'

// Mock webextension-polyfill types
vi.mock('webextension-polyfill', () => ({
  runtime: {
    onConnect: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
      hasListener: vi.fn(),
    },
  },
}))
