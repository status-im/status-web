import type { TypedDataField } from '../../lib/rpc/typed-data'

/**
 * Flattens an EIP-712 message into indented rows for the approval popup.
 *
 * Rows are driven by `types[primaryType]`, not by the message object: only the
 * declared fields end up in the hash, so a dApp can pad `message` with
 * hundreds of unsigned keys and push `spender` or `value` past the row cap.
 * Walking the type ignores the padding and keeps the signed fields visible.
 *
 * The payload is attacker-controlled. React escapes the text, so the risk is
 * not injection but a popup drowned in a megabyte of nesting -- hence the caps
 * below, which are what stops a hostile dApp from making the Decline button
 * unreachable.
 */

export const MAX_DEPTH = 4
export const MAX_ROWS = 200
export const MAX_VALUE_LENGTH = 200

export type TypedDataRow = {
  key: string
  /** `null` for a branch: the rows beneath it carry the values. */
  value: string | null
  depth: number
}

const ARRAY_SUFFIX = /\[\d*\]$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isField(value: unknown): value is TypedDataField {
  return (
    isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.type === 'string'
  )
}

/** Every attacker-controlled string reaching the popup goes through this. */
export function clip(text: string): string {
  return text.length > MAX_VALUE_LENGTH
    ? `${text.slice(0, MAX_VALUE_LENGTH)}…`
    : text
}

function formatLeaf(value: unknown): string {
  if (value === null || value === undefined) return 'null'
  if (typeof value === 'object') return Array.isArray(value) ? '[ … ]' : '{ … }'

  return clip(String(value))
}

export function flattenTypedData(
  message: unknown,
  types: unknown,
  primaryType: unknown,
): {
  rows: TypedDataRow[]
  truncated: boolean
} {
  const typeTable = isRecord(types) ? types : {}
  const root =
    typeof primaryType === 'string' ? typeTable[primaryType] : undefined

  // Nothing decodable. Flagged rather than reported as an empty message: the
  // popup must not look confident about a payload it cannot read.
  if (!Array.isArray(root)) return { rows: [], truncated: true }

  const rows: TypedDataRow[] = []
  let truncated = false

  // The type and the value disagree, so the value is summarised rather than
  // walked. Flagged: its contents are as invisible as anything past a cap.
  const pushLeaf = (key: string, node: unknown, depth: number) => {
    if (typeof node === 'object' && node !== null) truncated = true
    rows.push({ key, value: formatLeaf(node), depth })
  }

  const walk = (key: string, type: string, node: unknown, depth: number) => {
    if (rows.length >= MAX_ROWS) {
      truncated = true
      return
    }

    const label = clip(key)

    if (ARRAY_SUFFIX.test(type)) {
      if (!Array.isArray(node)) {
        pushLeaf(label, node, depth)
        return
      }
      if (depth >= MAX_DEPTH) {
        truncated = true
        rows.push({ key: label, value: '[ … ]', depth })
        return
      }

      const elementType = type.slice(0, type.lastIndexOf('['))
      rows.push({ key: label, value: null, depth })
      node.forEach((item, index) =>
        walk(String(index), elementType, item, depth + 1),
      )
      return
    }

    // An undeclared type is an EIP-712 atomic type, so the value is a leaf.
    // A struct whose value is not an object is a dApp bug viem will reject --
    // shown as-is rather than dressed up as a branch with no children.
    const struct = typeTable[type]
    if (!Array.isArray(struct) || !isRecord(node)) {
      pushLeaf(label, node, depth)
      return
    }
    if (depth >= MAX_DEPTH) {
      truncated = true
      rows.push({ key: label, value: '{ … }', depth })
      return
    }

    rows.push({ key: label, value: null, depth })
    for (const field of struct) {
      if (!isField(field)) continue
      walk(field.name, field.type, node[field.name], depth + 1)
    }
  }

  // A declared field missing from the message renders as `null`: omitting it
  // would hide it just as effectively as burying it under padding.
  const values = isRecord(message) ? message : {}
  for (const field of root) {
    if (!isField(field)) continue
    walk(field.name, field.type, values[field.name], 0)
  }

  return { rows, truncated }
}
