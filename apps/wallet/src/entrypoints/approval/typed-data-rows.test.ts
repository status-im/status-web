import { expect, test } from 'vitest'

import {
  clip,
  flattenTypedData,
  MAX_DEPTH,
  MAX_ROWS,
  MAX_VALUE_LENGTH,
} from './typed-data-rows'

test('a flat message becomes one row per field', () => {
  const { rows, truncated } = flattenTypedData({
    spender: '0xabc',
    value: '1000',
  })

  expect(rows).toEqual([
    { key: 'spender', value: '0xabc', depth: 0 },
    { key: 'value', value: '1000', depth: 0 },
  ])
  expect(truncated).toBe(false)
})

test('nested objects and arrays are indented by depth', () => {
  const { rows } = flattenTypedData({ permitted: [{ token: '0xabc' }] })

  expect(rows).toEqual([
    { key: 'permitted', value: null, depth: 0 },
    { key: '0', value: null, depth: 1 },
    { key: 'token', value: '0xabc', depth: 2 },
  ])
})

// A hostile dApp can nest as deep as it likes. Without the cap the popup
// renders until the Decline button is off-screen.
test('nesting past the depth cap is collapsed and flagged', () => {
  let deep: unknown = 'bottom'
  for (let i = 0; i < MAX_DEPTH + 3; i++) deep = { nested: deep }

  const { rows, truncated } = flattenTypedData(deep as object)

  expect(truncated).toBe(true)
  expect(Math.max(...rows.map(row => row.depth))).toBe(MAX_DEPTH)
  expect(rows.at(-1)).toEqual({
    key: 'nested',
    value: '{ … }',
    depth: MAX_DEPTH,
  })
})

test('more fields than the row cap are dropped and flagged', () => {
  const wide = Object.fromEntries(
    Array.from({ length: MAX_ROWS + 50 }, (_, i) => [`field${i}`, i]),
  )

  const { rows, truncated } = flattenTypedData(wide)

  expect(rows).toHaveLength(MAX_ROWS)
  expect(truncated).toBe(true)
})

test('an oversized value is clipped', () => {
  const { rows } = flattenTypedData({ note: 'x'.repeat(MAX_VALUE_LENGTH + 50) })

  expect(rows[0]!.value).toHaveLength(MAX_VALUE_LENGTH + 1)
  expect(rows[0]!.value!.endsWith('…')).toBe(true)
})

test('a message that is not an object renders nothing', () => {
  expect(flattenTypedData('not an object')).toEqual({
    rows: [],
    truncated: false,
  })
})

// `domain.name` and `verifyingContract` render outside the row list, so they
// need the same clipping -- an uncapped domain name pushed the message the
// user is meant to read off the popup.
test('clip caps any attacker-controlled string', () => {
  expect(clip('short')).toBe('short')
  expect(clip('x'.repeat(MAX_VALUE_LENGTH + 10))).toHaveLength(
    MAX_VALUE_LENGTH + 1,
  )
})
