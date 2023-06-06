import { base64url } from '@scure/base'
import { toHex, utf8ToBytes as toBytes } from 'ethereum-cryptography/utils'

import { recoverPublicKey } from './recover-public-key'
import { signData } from './sign-data'

import type { EncodedURLData } from './encode-url-data'

export async function signEncodedURLData(
  encodedURLData: EncodedURLData,
  privateKey: Uint8Array | string
): Promise<string> {
  const signature = await signData(encodedURLData, privateKey)
  const encodedSignature = base64url.encode(signature)

  return encodedSignature
}

export function recoverPublicKeyFromEncodedURLData(
  encodedURLData: string,
  encodedSignature: string
): string {
  const decodedSignature = base64url.decode(encodedSignature)
  const recoveredPublicKey = recoverPublicKey(
    decodedSignature,
    toBytes(encodedURLData)
  )

  return `0x${toHex(recoveredPublicKey)}`
}
