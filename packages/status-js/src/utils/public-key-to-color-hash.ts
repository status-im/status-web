import * as secp256k1 from 'ethereum-cryptography/secp256k1'

type ColorHash = number[][]

const COLOR_HASH_COLORS_COUNT = 32
const COLOR_HASH_SEGMENT_MAX_LENGTH = 5

export function publicKeyToColorHash(publicKey: string): ColorHash | undefined {
  const publicKeyHex = publicKey.replace(/^0[xX]/, '') // ensures hexadecimal digits without "base prefix"

  let compressedPublicKeyDigits: string
  try {
    compressedPublicKeyDigits =
      secp256k1.Point.fromHex(publicKeyHex).toHex(true) // validates and adds "sign prefix" too
  } catch (error) {
    return undefined
  }

  const colorHashHex = compressedPublicKeyDigits.slice(43, 63)
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

function numberToIndices(number: bigint, base: bigint): bigint[] {
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
