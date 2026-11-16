import { afterEach, describe, expect, it, vi } from 'vitest'

import { rpcRouter } from './rpc'

vi.mock('../../../config/env.server.mjs', () => ({
  serverEnv: {
    ETH_RPC_PROXY_URL: 'https://proxy.test',
    ETH_RPC_PROXY_AUTH_USERNAME: 'user',
    ETH_RPC_PROXY_AUTH_PASSWORD: 'pass',
  },
}))

const createCaller = () =>
  rpcRouter.createCaller({
    headers: new Headers({ 'x-forwarded-for': '192.0.2.10' }),
  })

describe('rpc.proxy method allowlist', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it.each([
    'debug_traceTransaction',
    'trace_block',
    'admin_peers',
    'txpool_content',
    'personal_sign',
    'eth_sign',
    'eth_signTypedData_v4',
    'eth_accounts',
    'unknown_method',
  ])('rejects %s without calling the node', async method => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      createCaller().proxy({ method, params: [], id: 7 }),
    ).resolves.toEqual({
      jsonrpc: '2.0',
      id: 7,
      error: { code: -32601, message: `Method not supported: ${method}` },
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('forwards an allowed method', async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({ jsonrpc: '2.0', id: 1, result: '0x1' }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      createCaller().proxy({ method: 'eth_blockNumber', id: 1 }),
    ).resolves.toEqual({ jsonrpc: '2.0', id: 1, result: '0x1' })
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
