import { bytesToHex, hexToBytes, isHex } from 'viem'

/**
 * A personal_sign message as every signer signs it: even-length hex is
 * decoded, any other string (odd-length or invalid hex included) is UTF-8,
 * like MetaMask.
 */
export function personalMessageBytes(message: string): Uint8Array {
  return isHex(message, { strict: true }) && message.length % 2 === 0
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
