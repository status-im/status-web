// Note: all files under /admin-panel are for testing. Please don't review this file
import { isAddress, parseBigIntInput } from '~utils/karma-input'

function toBigIntValue(value: unknown, field: string): bigint {
  if (typeof value === 'bigint') return value
  if (typeof value === 'number') return parseBigIntInput(String(value), field)
  if (typeof value === 'string') return parseBigIntInput(value, field)
  throw new Error(`${field} is required`)
}

export function parseEntriesJson(raw: string) {
  const entries: Array<{ account: `0x${string}`; amount: bigint }> = []
  const parsed: unknown = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('Merkle entries must be a JSON array')
  }

  for (const [index, entry] of parsed.entries()) {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`Invalid entry at index ${index}`)
    }

    const record = entry as Record<string, unknown>
    const account = record['account']

    if (typeof account !== 'string' || !isAddress(account)) {
      throw new Error(`Invalid account at entry ${index}`)
    }

    entries.push({
      account,
      amount: toBigIntValue(record['amount'], `entries[${index}].amount`),
    })
  }

  return entries
}

export function parseBatchDistributions(raw: string) {
  const distributions: Array<{ recipient: `0x${string}`; amount: bigint }> = []
  const parsed: unknown = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('Batch distributions must be a JSON array')
  }

  for (const [index, entry] of parsed.entries()) {
    if (!entry || typeof entry !== 'object') {
      throw new Error(`Invalid distribution at index ${index}`)
    }

    const record = entry as Record<string, unknown>
    const recipient = record['recipient']

    if (typeof recipient !== 'string' || !isAddress(recipient)) {
      throw new Error(`Invalid recipient at distribution ${index}`)
    }

    distributions.push({
      recipient,
      amount: toBigIntValue(record['amount'], `distributions[${index}].amount`),
    })
  }

  return distributions
}
