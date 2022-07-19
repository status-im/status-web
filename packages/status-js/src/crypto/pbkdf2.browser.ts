import type { pbkdf2 as pbkdf2Type } from 'ethereum-cryptography/pbkdf2'

type PBKDF2 = typeof pbkdf2Type

export const pbkdf2: PBKDF2 = async (
  password: Uint8Array,
  salt: Uint8Array,
  iterations: number,
  keylen: number
): Promise<Uint8Array> => {
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    password,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )

  const derivedKey = await window.crypto.subtle.deriveBits(
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
