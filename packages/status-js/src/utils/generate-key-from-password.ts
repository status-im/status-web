import { utf8ToBytes } from 'ethereum-cryptography/utils'

import { pbkdf2 } from '../crypto/pbkdf2.browser'

const AES_KEY_LENGTH = 32 // bytes

/**
 * status-go: https://github.com/status-im/status-go/blob/a471fed6a64e01a1aba8d925377fba045a5aa9f9/wakuv2/waku.go#L713
 */
export async function generateKeyFromPassword(
  password: string
): Promise<Uint8Array> {
  return await pbkdf2(
    utf8ToBytes(password),
    utf8ToBytes(''),
    65356,
    AES_KEY_LENGTH,
    'sha256'
  )
}
