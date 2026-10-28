import { bytesToHex, hexToBytes, isHex } from 'viem'

/** A personal_sign message as the software wallet signs it: hex is decoded, any other string is UTF-8. */
export function personalMessageBytes(message: string): Uint8Array {
  return isHex(message, { strict: true })
    ? hexToBytes(message)
    : new TextEncoder().encode(message)
}

/** A personal_sign message as the user reads it: UTF-8 text, or hex when the bytes are not valid UTF-8. */
export function personalMessageText(message: string): string {
  const bytes = personalMessageBytes(message)
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    return bytesToHex(bytes)
  }
}
