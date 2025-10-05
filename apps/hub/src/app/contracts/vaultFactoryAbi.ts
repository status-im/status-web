export const vaultFactoryAbi = [
  {
    inputs: [],
    name: 'createVault',
    outputs: [
      { internalType: 'contract StakeVault', name: '', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
