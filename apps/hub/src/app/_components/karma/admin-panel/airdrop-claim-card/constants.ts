// Note: all files under /admin-panel are for testing. Please don't review this file

export const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

export const pausableAbi = [
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const tokenGetterAbi = [
  {
    inputs: [],
    name: 'token',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const tokenUpperGetterAbi = [
  {
    inputs: [],
    name: 'TOKEN',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
