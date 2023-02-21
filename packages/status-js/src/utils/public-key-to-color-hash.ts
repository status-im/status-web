import * as secp256k1 from 'ethereum-cryptography/secp256k1'

import { compressPublicKey } from './compress-public-key'

export type ColorHash = number[][]

const COLOR_HASH_COLORS_COUNT = 32
const COLOR_HASH_SEGMENT_MAX_LENGTH = 5

/**
 * @see https://github.com/status-im/specs/pull/166 for specs
 */
export function publicKeyToColorHash(publicKey: string): ColorHash {
  const compressedPublicKey = compressPublicKey(publicKey)

  const colorHashHex = compressedPublicKey.slice(43, 63)
  const colorHash = hexToColorHash(
    colorHashHex,
    COLOR_HASH_COLORS_COUNT,
    COLOR_HASH_SEGMENT_MAX_LENGTH
  )

  return colorHash
}

export function hexToColorHash(
  hex: string,
  colorsCount: number,
  segmentLength: number
): ColorHash {
  const colorIndices = numberToIndices(
    BigInt(`0x${hex}`),
    BigInt(colorsCount * segmentLength)
  )
  const colorHash = colorIndicesToColorHash(colorIndices, colorsCount)

  return colorHash
}

export function numberToIndices(number: bigint, base: bigint): bigint[] {
  const indices: bigint[] = []
  let nextNumber = number

  if (nextNumber === 0n) {
    return [0n]
  }

  while (nextNumber > 0n) {
    const modulo = secp256k1.utils.mod(nextNumber, base)
    nextNumber = nextNumber / base // truncates fractional results

    indices.push(modulo)
  }

  return indices.reverse()
}

function colorIndicesToColorHash(
  colorIndices: bigint[],
  colorsCount: number
): ColorHash {
  const colorHash: ColorHash = []
  let previousColorIndex: number | undefined = undefined

  for (const currentColorIndex of colorIndices) {
    const colorLength = Math.ceil((Number(currentColorIndex) + 1) / colorsCount)
    const nextColorIndex = Number(currentColorIndex % BigInt(colorsCount))

    let colorIndex: number
    if (nextColorIndex !== previousColorIndex) {
      colorIndex = nextColorIndex
    } else {
      colorIndex = Number((currentColorIndex + 1n) % BigInt(colorsCount))
    }

    previousColorIndex = colorIndex

    colorHash.push([colorLength, colorIndex])
  }

  return colorHash
}
