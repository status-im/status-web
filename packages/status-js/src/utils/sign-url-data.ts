import { base64url } from '@scure/base'

import { signData, verifySignedData } from './sign-data'

import type { EncodedUrlData } from './encode-url-data'

export async function signEncodedUrlData(
  encodedUrlData: EncodedUrlData,
  privateKey: Uint8Array | string
): Promise<string> {
  const signatrue = await signData(encodedUrlData, privateKey)

  return base64url.encode(signatrue)
}

export function verifyEncodedUrlData(
  encodedSignature: string,
  encodedUrlData: EncodedUrlData
): boolean {
  const signature = base64url.decode(encodedSignature)

  return verifySignedData(signature, encodedUrlData)
}
