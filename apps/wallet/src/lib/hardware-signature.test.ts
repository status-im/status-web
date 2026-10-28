import {
  type Hex,
  hexToBytes,
  keccak256,
  serializeTransaction,
  toBytes,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { describe, expect, it } from 'vitest'

import { checkHardwareSignature } from './hardware-signature'

// Hardhat's first two dev keys: the account, and a key the device should not use.
const account = privateKeyToAccount(
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
)
const otherKey = privateKeyToAccount(
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a7412f4603b6b78690d',
)

const TYPED_DATA = {
  domain: { name: 'Test', version: '1', chainId: 1 },
  types: { Mail: [{ name: 'contents', type: 'string' }] },
  primaryType: 'Mail',
  message: { contents: 'Hello' },
} as const

const UNSIGNED_TX = serializeTransaction({
  type: 'eip1559',
  chainId: 1,
  nonce: 3,
  to: otherKey.address,
  value: 1n,
  gas: 21000n,
  maxFeePerGas: 2n,
  maxPriorityFeePerGas: 1n,
})

/** r || s with v as the bare parity, as some devices answer. */
function withParityV(signature: Hex): Hex {
  const v = Number.parseInt(signature.slice(-2), 16)
  return `0x${signature.slice(2, -2)}${(v - 27).toString(16).padStart(2, '0')}`
}

describe('checkHardwareSignature', () => {
  it('accepts a personal message signed by the account', async () => {
    const message = toBytes('Hello')
    const signature = await account.signMessage({ message: { raw: message } })

    expect(
      checkHardwareSignature(
        { kind: 'personalMessage', message },
        account.address,
        signature,
      ),
    ).toBeNull()
  })

  it('accepts typed data signed by the account', async () => {
    const signature = await account.signTypedData(TYPED_DATA)

    expect(
      checkHardwareSignature(
        { kind: 'typedData', typedData: JSON.stringify(TYPED_DATA) },
        account.address,
        signature,
      ),
    ).toBeNull()
  })

  it.each([27, 0])(
    'accepts a transaction signed by the account with v offset %i',
    async offset => {
      const signature = await account.sign({ hash: keccak256(UNSIGNED_TX) })

      expect(
        checkHardwareSignature(
          {
            kind: 'transaction',
            serializedTx: hexToBytes(UNSIGNED_TX),
            chainId: 1,
          },
          account.address,
          offset === 27 ? signature : withParityV(signature),
        ),
      ).toBeNull()
    },
  )

  it('names the signer when another key signed', async () => {
    const message = toBytes('Hello')
    const signature = await otherKey.signMessage({ message: { raw: message } })

    expect(
      checkHardwareSignature(
        { kind: 'personalMessage', message },
        account.address,
        signature,
      ),
    ).toBe(
      `Signed by ${otherKey.address}, not by this account. Check that the device signs with this account.`,
    )
  })

  it('refuses a signature over a different payload', async () => {
    const signature = await account.signMessage({
      message: { raw: toBytes('An older request') },
    })

    expect(
      checkHardwareSignature(
        { kind: 'personalMessage', message: toBytes('Hello') },
        account.address,
        signature,
      ),
    ).not.toBeNull()
  })

  it('refuses a signature with a v that is neither a parity nor a legacy v', async () => {
    const message = toBytes('Hello')
    const signature = await account.signMessage({ message: { raw: message } })

    expect(
      checkHardwareSignature(
        { kind: 'personalMessage', message },
        account.address,
        `${signature.slice(0, -2)}05`,
      ),
    ).toBe('This QR code is not a signature for this request.')
  })
})
