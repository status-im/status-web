import { expect, test } from 'vitest'

import {
  clip,
  flattenTypedData,
  MAX_DEPTH,
  MAX_ROWS,
  MAX_VALUE_LENGTH,
} from './typed-data-rows'

const permitTypes = {
  Permit: [
    { name: 'spender', type: 'address' },
    { name: 'value', type: 'uint256' },
  ],
}

test('a flat message becomes one row per declared field', () => {
  const { rows, truncated } = flattenTypedData(
    { spender: '0xabc', value: '1000' },
    permitTypes,
    'Permit',
  )

  expect(rows).toEqual([
    { key: 'spender', value: '0xabc', depth: 0 },
    { key: 'value', value: '1000', depth: 0 },
  ])
  expect(truncated).toBe(false)
})

// The signature covers `types[primaryType]` only. Walking the message instead
// let a dApp bury `spender` and `value` under enough unsigned padding to push
// them past the row cap, and the user approved what they never saw.
test('unsigned padding cannot push signed fields out of view', () => {
  const message: Record<string, unknown> = Object.fromEntries(
    Array.from({ length: MAX_ROWS + 50 }, (_, i) => [`filler${i}`, i]),
  )
  message.spender = '0xattacker'
  message.value = '115792089237316195423570985008687907853269984665640564039457'

  const { rows, truncated } = flattenTypedData(message, permitTypes, 'Permit')

  expect(rows).toEqual([
    { key: 'spender', value: '0xattacker', depth: 0 },
    {
      key: 'value',
      value: '115792089237316195423570985008687907853269984665640564039457',
      depth: 0,
    },
  ])
  expect(truncated).toBe(false)
})

test('a declared field missing from the message renders as null', () => {
  const { rows } = flattenTypedData({ spender: '0xabc' }, permitTypes, 'Permit')

  expect(rows).toEqual([
    { key: 'spender', value: '0xabc', depth: 0 },
    { key: 'value', value: 'null', depth: 0 },
  ])
})

test('nested structs and struct arrays are indented by depth', () => {
  const { rows } = flattenTypedData(
    { permitted: [{ token: '0xabc' }] },
    {
      PermitBatch: [{ name: 'permitted', type: 'TokenPermissions[]' }],
      TokenPermissions: [{ name: 'token', type: 'address' }],
    },
    'PermitBatch',
  )

  expect(rows).toEqual([
    { key: 'permitted', value: null, depth: 0 },
    { key: '0', value: null, depth: 1 },
    { key: 'token', value: '0xabc', depth: 2 },
  ])
})

// A self-referencing type is legal EIP-712 and recurses forever without the
// cap; the depth cap is what terminates the walk.
test('nesting past the depth cap is collapsed and flagged', () => {
  let deep: unknown = { nested: 'bottom' }
  for (let i = 0; i < MAX_DEPTH + 3; i++) deep = { nested: deep }

  const { rows, truncated } = flattenTypedData(
    deep,
    { Node: [{ name: 'nested', type: 'Node' }] },
    'Node',
  )

  expect(truncated).toBe(true)
  expect(Math.max(...rows.map(row => row.depth))).toBe(MAX_DEPTH)
  expect(rows.at(-1)).toEqual({
    key: 'nested',
    value: '{ … }',
    depth: MAX_DEPTH,
  })
})

test('more declared fields than the row cap are dropped and flagged', () => {
  const fields = Array.from({ length: MAX_ROWS + 50 }, (_, i) => ({
    name: `field${i}`,
    type: 'uint256',
  }))
  const message = Object.fromEntries(fields.map((field, i) => [field.name, i]))

  const { rows, truncated } = flattenTypedData(
    message,
    { Wide: fields },
    'Wide',
  )

  expect(rows).toHaveLength(MAX_ROWS)
  expect(truncated).toBe(true)
})

test('an oversized value is clipped', () => {
  const { rows } = flattenTypedData(
    { note: 'x'.repeat(MAX_VALUE_LENGTH + 50) },
    { Memo: [{ name: 'note', type: 'string' }] },
    'Memo',
  )

  expect(rows[0]!.value).toHaveLength(MAX_VALUE_LENGTH + 1)
  expect(rows[0]!.value!.endsWith('…')).toBe(true)
})

// An empty row list would read as "this message signs nothing", which is a
// claim the popup cannot make about a payload it failed to decode.
test('an undecodable payload renders nothing and is flagged', () => {
  expect(
    flattenTypedData({ spender: '0xabc' }, permitTypes, 'Missing'),
  ).toEqual({ rows: [], truncated: true })
  expect(flattenTypedData({ spender: '0xabc' }, 'not types', 'Permit')).toEqual(
    {
      rows: [],
      truncated: true,
    },
  )
})

// A value the declared type says is atomic is summarised, not walked, so its
// contents are as hidden as anything past a cap and must be flagged as such.
test('a value the type does not describe is collapsed and flagged', () => {
  const { rows, truncated } = flattenTypedData(
    { note: { hidden: 'payload' } },
    { Memo: [{ name: 'note', type: 'string' }] },
    'Memo',
  )

  expect(rows).toEqual([{ key: 'note', value: '{ … }', depth: 0 }])
  expect(truncated).toBe(true)
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
