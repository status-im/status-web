import { expect, test } from 'vitest'

import { signedDomainFields } from './typed-data'

test('without a declared EIP712Domain every present domain field is signed', () => {
  const fields = signedDomainFields(
    { name: 'Uniswap', verifyingContract: '0xabc' },
    { Permit: [] },
  )

  expect([...fields].sort()).toEqual(['name', 'verifyingContract'])
})

// A dApp that declares EIP712Domain itself decides what the domain separator
// covers. A `name` left out of it is never signed, so nothing downstream may
// present it as the dApp's identity.
test('a declared EIP712Domain limits the domain fields to what it names', () => {
  const fields = signedDomainFields(
    { name: 'Uniswap', verifyingContract: '0xabc' },
    { EIP712Domain: [{ name: 'verifyingContract', type: 'address' }] },
  )

  expect([...fields]).toEqual(['verifyingContract'])
})

// Declared and present can diverge either way; the set answers only what the
// type declares, and callers pair it with the value they actually have.
test('a declared field absent from the domain stays in the set', () => {
  const fields = signedDomainFields(
    { name: 'Uniswap' },
    {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'salt', type: 'bytes32' },
      ],
    },
  )

  expect([...fields].sort()).toEqual(['name', 'salt'])
})
