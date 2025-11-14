export const karmaTierAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'EmptyTierName',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EmptyTiersArray',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'minKarma',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxKarma',
        type: 'uint256',
      },
    ],
    name: 'InvalidTierRange',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidTxAmount',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'index',
        type: 'uint8',
      },
      {
        internalType: 'uint256',
        name: 'expectedMinKarma',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'actualMinKarma',
        type: 'uint256',
      },
    ],
    name: 'NonContiguousTiers',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'nameLength',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxLength',
        type: 'uint256',
      },
    ],
    name: 'TierNameTooLong',
    type: 'error',
  },
  {
    inputs: [],
    name: 'TierNotFound',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'TiersUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MAX_TIER_NAME_LENGTH',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint8',
        name: 'tierId',
        type: 'uint8',
      },
    ],
    name: 'getTierById',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'minKarma',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxKarma',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'uint32',
            name: 'txPerEpoch',
            type: 'uint32',
          },
        ],
        internalType: 'struct KarmaTiers.Tier',
        name: 'tier',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTierCount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'count',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'karmaBalance',
        type: 'uint256',
      },
    ],
    name: 'getTierIdByKarmaBalance',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'tiers',
    outputs: [
      {
        internalType: 'uint256',
        name: 'minKarma',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxKarma',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'uint32',
        name: 'txPerEpoch',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'minKarma',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxKarma',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'uint32',
            name: 'txPerEpoch',
            type: 'uint32',
          },
        ],
        internalType: 'struct KarmaTiers.Tier[]',
        name: 'newTiers',
        type: 'tuple[]',
      },
    ],
    name: 'updateTiers',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
