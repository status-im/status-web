import { hexToBytes, isHex } from 'viem'

/** A personal_sign message as the software wallet signs it: hex is decoded, any other string is UTF-8. */
export function personalMessageBytes(message: string): Uint8Array {
  return isHex(message, { strict: true })
    ? hexToBytes(message)
    : new TextEncoder().encode(message)
}
