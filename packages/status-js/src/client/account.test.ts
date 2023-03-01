import { expect, test } from 'vitest'

import { Account } from './account'

import type { Client } from './client'

test('should verify the signature', async () => {
  // @fixme
  const account = new Account({} as unknown as Client)

  const signature = await account.sign('123')

  expect(account.verify(signature, '123')).toBe(true)
})

test('should not verify signature with different message', async () => {
  // @fixme
  const account = new Account({} as unknown as Client)

  const signature = await account.sign('abc')

  expect(account.verify(signature, '123')).toBe(false)
})
