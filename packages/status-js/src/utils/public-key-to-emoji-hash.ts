import { emojis } from '../consts/emojis'
import { compressPublicKey } from './compress-public-key'
import { numberToIndices } from './public-key-to-color-hash'

const MIN_EMOJI_HASH_EMOJIS_COUNT = 2757
const EMOJI_HASH_LENGTH = 14

/**
 * @see https://github.com/status-im/specs/pull/166 for specs
 */
export function publicKeyToEmojiHash(publicKey: string): string {
  if (emojis.length < MIN_EMOJI_HASH_EMOJIS_COUNT) {
    throw new Error('Not enough emojis')
  }

  const compressedPublicKeyHex = compressPublicKey(publicKey)

  const emojiHashHex = compressedPublicKeyHex.slice(3, 43)
  const emojiHash = hexToEmojiHash(
    emojiHashHex,
    MIN_EMOJI_HASH_EMOJIS_COUNT,
    EMOJI_HASH_LENGTH
  )

  return emojiHash
}

export function hexToEmojiHash(
  hex: string,
  emojisCount: number,
  hashLength: number
): string {
  const emojiIndices = numberToIndices(BigInt(`0x${hex}`), BigInt(emojisCount))
  const emojiHash = emojiIndicesToEmojiHash(emojiIndices, hashLength)

  return emojiHash
}

function emojiIndicesToEmojiHash(emojiIndices: bigint[], hashLength: number) {
  let emojiHash = ''

  if (emojiIndices.length < hashLength) {
    let fillerIndices = hashLength - emojiIndices.length

    while (fillerIndices--) {
      emojiIndices.unshift(BigInt(0))
    }
  }

  for (const i of emojiIndices) {
    emojiHash += emojis[Number(i)]
  }

  return emojiHash
}
