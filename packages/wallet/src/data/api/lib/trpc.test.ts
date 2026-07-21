import { describe, expect, it } from 'vitest'

import { getRpcCategory } from './trpc'

describe('getRpcCategory', () => {
  it('categorizes named API routes', () => {
    expect(getRpcCategory('nodes.getFeeRate')).toBe('minimal')
    expect(getRpcCategory('activities.page')).toBe('permanent')
    expect(getRpcCategory('assets.nativeToken')).toBe('short')
  })

  it('categorizes rpc.proxy from its JSON-RPC method', () => {
    expect(
      getRpcCategory('rpc.proxy', { method: 'eth_getTransactionReceipt' }),
    ).toBe('permanent')
    expect(
      getRpcCategory('rpc.proxy', { json: { method: 'eth_blockNumber' } }),
    ).toBe('short')
    expect(getRpcCategory('rpc.proxy', { method: 'eth_estimateGas' })).toBe(
      'short',
    )
  })

  it('uses the short category for unknown methods', () => {
    expect(getRpcCategory('rpc.proxy', { method: 'eth_chainId' })).toBe('short')
  })
})
