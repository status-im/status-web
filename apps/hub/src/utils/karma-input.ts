export function parseBigIntInput(value: string, field: string): bigint {
  if (!value || value.trim() === '') {
    throw new Error(`${field} is required`)
  }
  return BigInt(value.trim())
}

export function isAddress(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{40}$/.test(value)
}

export function isBytes32(value: string): value is `0x${string}` {
  return /^0x[a-fA-F0-9]{64}$/.test(value)
}
