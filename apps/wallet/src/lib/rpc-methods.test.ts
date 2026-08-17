import { expect, test } from 'vitest'

import { REMOTE_ALLOWED } from './rpc-methods'

// The table is a transcription of status-go @384a179 services/connector
// remote.go. A silent drop is a broken dApp and a silent addition is a hole in
// the gate, so pin the count.
test('the remote allowlist matches status-go', () => {
  expect(REMOTE_ALLOWED.size).toBe(35)
})

test('methods status-go deliberately excludes are absent', () => {
  for (const method of [
    'eth_accounts',
    'eth_sign',
    'eth_sendTransaction',
    'net_version',
  ]) {
    expect(REMOTE_ALLOWED.has(method)).toBe(false)
  }
})
