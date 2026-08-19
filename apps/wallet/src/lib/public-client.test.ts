import { describe, expect, test } from 'vitest'

import { getPublicClient } from './public-client'

describe('getPublicClient', () => {
  test('routes a chain through its own proxy path', () => {
    const client = getPublicClient(1)

    expect(client.chain?.id).toBe(1)
    expect(client.transport.url).toContain('chainId=1')
  })

  test('reuses the client for a chain', () => {
    expect(getPublicClient(1)).toBe(getPublicClient(1))
  })

  // Advertised and switchable, but the wallet's proxy has no upstream route
  // for it. Answering from mainnet instead is the bug this replaces.
  test('refuses a chain with no upstream route', () => {
    expect(() => getPublicClient(1660990954)).toThrowError(
      expect.objectContaining({
        code: 4901,
        message: 'Chain 1660990954 is not available',
      }),
    )
  })

  test('refuses a chain the wallet does not know', () => {
    expect(() => getPublicClient(137)).toThrow(/not available/)
  })
})
