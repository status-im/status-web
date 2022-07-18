import _crypto from 'crypto'

import type { pbkdf2 as pbkdf2Type } from 'ethereum-cryptography/pbkdf2'

type PBKDF2 = typeof pbkdf2Type

let crypto: Crypto

if (globalThis.crypto) {
  crypto = globalThis.crypto
} else if (_crypto.webcrypto) {
  /**
   * Note: allows debugging and testing with `vite-node` and `vitest`
   *
   * Note: `webcrypto` is experimental (@see https://nodejs.org/dist/latest-v16.x/docs/api/webcrypto.html#web-crypto-api)
   */
  crypto = _crypto.webcrypto as unknown as Crypto
} else {
  throw new Error('Crypto is not supported in this environment')
}

export const pbkdf2: PBKDF2 = async (
  password: Uint8Array,
  salt: Uint8Array,
  iterations: number,
  keylen: number
): Promise<Uint8Array> => {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    password,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: {
        name: 'SHA-256',
      },
    },
    cryptoKey,
    keylen << 3
  )

  return new Uint8Array(derivedKey)
}
