import { base64url } from '@scure/base'
import { getPublicKey } from 'ethereum-cryptography/secp256k1'
import { bytesToHex } from 'ethereum-cryptography/utils'

import { deserializePublicKey } from './deserialize-public-key'
import {
  decodeVerificationURLHash,
  encodeVerificationURLHash,
} from './encode-url-hash'
import { serializePublicKey } from './serialize-public-key'
import { signData, verifySignedData } from './sign-data'

import type { EncodedURLData } from './encode-url-data'
import type { EncodedVerificationURLHash } from './encode-url-hash'

export async function signEncodedURLData(
  encodedURLData: EncodedURLData,
  privateKey: Uint8Array | string
): Promise<EncodedVerificationURLHash> {
  const signature = await signData(encodedURLData, privateKey)

  const encodedSignature = base64url.encode(signature)
  const serializedPublicKey = serializePublicKey(
    `0x${bytesToHex(getPublicKey(privateKey))}`
  )

  return encodeVerificationURLHash({
    signature: encodedSignature,
    publicKey: serializedPublicKey,
  })
}

export function verifyEncodedURLData(
  encodedURLData: EncodedURLData,
  encodedVerificationURLHash: EncodedVerificationURLHash
): boolean {
  const { signature, publicKey } = decodeVerificationURLHash(
    encodedVerificationURLHash
  )

  const decodedSignature = base64url.decode(signature)
  const deserializedPublicKey = deserializePublicKey(publicKey, {
    compress: false,
  })

  return verifySignedData(
    decodedSignature,
    encodedURLData,
    deserializedPublicKey
  )
}
