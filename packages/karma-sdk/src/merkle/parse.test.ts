import { describe, expect, it } from 'vitest'

import {
  parseMerkleTreeOutput,
  serializeMerkleTreeOutput,
} from './parse'

describe('parseMerkleTreeOutput', () => {
  it('parses json and converts bigint fields', () => {
    const parsed = parseMerkleTreeOutput(
      JSON.stringify({
        root: '0xabc',
        entries: [
          {
            index: '0',
            account: '0x0000000000000000000000000000000000000001',
            amount: '100',
            proof: ['0xdef'],
          },
        ],
      })
    )

    expect(parsed.root).toBe('0xabc')
    expect(parsed.entries[0]?.index).toBe(0n)
    expect(parsed.entries[0]?.amount).toBe(100n)
  })

  it('serializes bigint fields as strings', () => {
    const serialized = serializeMerkleTreeOutput({
      root: '0xabc',
      entries: [
        {
          index: 1n,
          account: '0x0000000000000000000000000000000000000001',
          amount: 200n,
          proof: ['0xdef'],
        },
      ],
    })

    expect(serialized).toContain('"index": "1"')
    expect(serialized).toContain('"amount": "200"')
  })
})
