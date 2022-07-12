// todo?: move to __tests__/, tests/

import { beforeEach, describe, expect, test, vi } from 'vitest'

import { Community } from './community'

import type { Waku } from 'js-waku'

// todo: move to __mocks__
// todo?: mock all methods with one func; vi.mock('')
const WakuMock = {
  store: {
    queryHistory: vi.fn(),
  },
  relay: {
    addObserver: vi.fn(),
    addDecryptionKey: vi.fn(),
    deleteObserver: vi.fn(),
    send: vi.fn(),
  },
} as unknown as Waku

describe('Community', () => {
  const community = new Community(
    // fixme!:
    null!,
    '0x029f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb4542955133'
  )

  beforeEach(() => {
    // todo?: set as config instead
    vi.resetAllMocks()
  })

  // todo?: use `it`
  test('is owner', () => {
    expect(
      community.isOwner(
        '0x049f196bbfef4fa6a5eb81dd802133a63498325445ca1af1d154b1bb454295513305b23fcf11d005ee622144fc402b713a8928f80d705781e2e78d701c6e01bfc4'
      )
    ).toBe(true)
    expect(
      community.isOwner(
        '0x044646ae5047316b4230d0086c8acec687f00b1cd9d1dc634f6cb358ac0a9a8ffffe77b4dd0a4bfb95851f3b7355c781dd60f8418fc8a65d14907aff47c903a559'
      )
    ).toBe(false)
  })

  // todo?: test fetch
})
