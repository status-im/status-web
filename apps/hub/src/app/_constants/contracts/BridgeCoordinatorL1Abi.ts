export const bridgeCoordinatorL1Abi = [
  {
    inputs: [
      { internalType: 'bytes32', name: 'chainNickname', type: 'bytes32' },
      { internalType: 'address', name: 'sender', type: 'address' },
      { internalType: 'bytes32', name: 'remoteRecipient', type: 'bytes32' },
    ],
    name: 'getPredeposit',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'chainNickname', type: 'bytes32' },
    ],
    name: 'getTotalPredeposits',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'chainNickname', type: 'bytes32' },
    ],
    name: 'getChainPredepositState',
    outputs: [
      { internalType: 'enum PredepositState', name: '', type: 'uint8' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes32', name: 'chainNickname', type: 'bytes32' },
    ],
    name: 'getChainIdForNickname',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
    name: 'encodeOmnichainAddress',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'encoded', type: 'bytes32' }],
    name: 'decodeOmnichainAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'pure',
    type: 'function',
  },
] as const
