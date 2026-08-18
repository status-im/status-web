/**
 * Flattens an EIP-712 message into indented rows for the approval popup.
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

export function flattenTypedData(message: unknown): {
  rows: TypedDataRow[]
  truncated: boolean
} {
  const rows: TypedDataRow[] = []
  let truncated = false

  const walk = (key: string, node: unknown, depth: number) => {
    if (rows.length >= MAX_ROWS) {
      truncated = true
      return
    }

    const isBranch = typeof node === 'object' && node !== null
    if (!isBranch || depth >= MAX_DEPTH) {
      if (isBranch) truncated = true
      rows.push({ key, value: formatLeaf(node), depth })
      return
    }

    rows.push({ key, value: null, depth })
    const entries = Array.isArray(node)
      ? node.map((item, index) => [String(index), item] as const)
      : Object.entries(node as Record<string, unknown>)
    for (const [childKey, child] of entries) walk(childKey, child, depth + 1)
  }

  const root =
    typeof message === 'object' && message !== null
      ? Object.entries(message as Record<string, unknown>)
      : []
  for (const [key, value] of root) walk(key, value, 0)

  return { rows, truncated }
}
