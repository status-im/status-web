import type { AirdropEntry, MerkleTreeOutput } from './tree'

type UnknownRecord = Record<string, unknown>

function isHexString(value: unknown): value is `0x${string}` {
  return typeof value === 'string' && value.startsWith('0x')
}

function asBigInt(value: unknown, fieldName: string): bigint {
  if (typeof value === 'bigint') return value
  if (typeof value === 'number' && Number.isInteger(value)) return BigInt(value)
  if (typeof value === 'string' && value.trim().length > 0) {
    return BigInt(value)
  }
  throw new Error(`Invalid bigint field: ${fieldName}`)
}

function parseEntry(
  value: unknown,
  index: number,
): AirdropEntry & {
  proof: `0x${string}`[]
} {
  if (!value || typeof value !== 'object') {
    throw new Error(`Invalid merkle entry at index ${index}`)
  }

  const record = value as UnknownRecord
  const account = record['account']
  const proof = record['proof']

  if (!isHexString(account)) {
    throw new Error(`Invalid account at entry ${index}`)
  }

  if (!Array.isArray(proof) || !proof.every(isHexString)) {
    throw new Error(`Invalid proof at entry ${index}`)
  }

  return {
    index: asBigInt(record['index'], `entries[${index}].index`),
    account,
    amount: asBigInt(record['amount'], `entries[${index}].amount`),
    proof,
  }
}

export function parseMerkleTreeOutput(
  raw: string | MerkleTreeOutput,
): MerkleTreeOutput {
  const data: unknown = typeof raw === 'string' ? JSON.parse(raw) : raw

  if (!data || typeof data !== 'object') {
    throw new Error('Invalid merkle tree payload')
  }

  const record = data as UnknownRecord
  const root = record['root']
  const entries = record['entries']

  if (!isHexString(root)) {
    throw new Error('Invalid merkle root')
  }

  if (!Array.isArray(entries)) {
    throw new Error('Invalid merkle entries')
  }

  return {
    root,
    entries: entries.map(parseEntry),
  }
}

export function serializeMerkleTreeOutput(tree: MerkleTreeOutput): string {
  return JSON.stringify(
    {
      root: tree.root,
      entries: tree.entries.map(entry => ({
        index: entry.index.toString(),
        account: entry.account,
        amount: entry.amount.toString(),
        proof: entry.proof,
      })),
    },
    null,
    2,
  )
}
