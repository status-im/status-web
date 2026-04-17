import { Interface } from 'ethers'

import {
  ANVIL_TEST_ERC721,
  ANVIL_TEST_ERC721_TOKEN_ID,
  ANVIL_TEST_ERC1155,
  ANVIL_TEST_ERC1155_TOKEN_ID,
  callAnvilRpc,
  isAnvilTestContract,
} from './anvil-rpc'

import type { Collectible, NetworkType } from '@status-im/wallet/data'

const NETWORK: NetworkType = 'ethereum'

const erc721 = new Interface([
  'function ownerOf(uint256 tokenId) view returns (address)',
])
const erc1155 = new Interface([
  'function balanceOf(address account, uint256 id) view returns (uint256)',
])

const buildImage = (label: string, accent: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="720" height="720" viewBox="0 0 720 720">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="720" height="720" rx="64" fill="url(#bg)" />
      <circle cx="560" cy="160" r="96" fill="rgba(255,255,255,0.16)" />
      <circle cx="180" cy="520" r="140" fill="rgba(255,255,255,0.08)" />
      <text x="64" y="136" fill="#f8fafc" font-family="Arial, sans-serif" font-size="36">Status Wallet</text>
      <text x="64" y="356" fill="#ffffff" font-family="Arial, sans-serif" font-size="92" font-weight="700">${label}</text>
      <text x="64" y="432" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="32">Local anvil collectible</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const truncateId = (id: string) => (id.length > 6 ? `${id.slice(0, 6)}...` : id)
const formatDisplayName = (name: string, displayId: string) =>
  /#\d+/.test(name) ? name : `${name} #${displayId}`

const BASE_COLLECTIBLES: Record<string, Collectible> = {
  [`${ANVIL_TEST_ERC721.toLowerCase()}:${ANVIL_TEST_ERC721_TOKEN_ID}`]: {
    id: ANVIL_TEST_ERC721_TOKEN_ID,
    displayId: truncateId(ANVIL_TEST_ERC721_TOKEN_ID),
    contract: ANVIL_TEST_ERC721,
    isSpam: false,
    name: 'Status Test ERC721',
    displayName: formatDisplayName(
      'Status Test ERC721',
      truncateId(ANVIL_TEST_ERC721_TOKEN_ID),
    ),
    image: buildImage('ERC721', '#2563eb'),
    thumbnail: buildImage('ERC721', '#2563eb'),
    collection: {
      name: 'Status Local Tests',
      size: 1,
    },
    links: {
      opensea: '',
    },
    about:
      'Deterministic ERC721 collectible deployed on the local anvil chain.',
    network: NETWORK,
    standard: 'ERC721',
    traits: {
      Environment: 'anvil',
      TokenId: ANVIL_TEST_ERC721_TOKEN_ID,
    },
  },
  [`${ANVIL_TEST_ERC1155.toLowerCase()}:${ANVIL_TEST_ERC1155_TOKEN_ID}`]: {
    id: ANVIL_TEST_ERC1155_TOKEN_ID,
    displayId: truncateId(ANVIL_TEST_ERC1155_TOKEN_ID),
    contract: ANVIL_TEST_ERC1155,
    isSpam: false,
    name: 'Status Test ERC1155',
    displayName: formatDisplayName(
      'Status Test ERC1155',
      truncateId(ANVIL_TEST_ERC1155_TOKEN_ID),
    ),
    image: buildImage('ERC1155', '#0f766e'),
    thumbnail: buildImage('ERC1155', '#0f766e'),
    collection: {
      name: 'Status Local Tests',
      size: 3,
    },
    links: {
      opensea: '',
    },
    about:
      'Deterministic ERC1155 collectible deployed on the local anvil chain.',
    network: NETWORK,
    standard: 'ERC1155',
    traits: {
      Environment: 'anvil',
      TokenId: ANVIL_TEST_ERC1155_TOKEN_ID,
    },
  },
}

const cloneCollectible = (collectible: Collectible): Collectible => ({
  ...collectible,
  collection: { ...collectible.collection },
  links: { ...collectible.links },
  traits: collectible.traits ? { ...collectible.traits } : undefined,
})

const matchesSearch = (collectible: Collectible, search?: string) => {
  if (!search) {
    return true
  }

  const value = search.toLowerCase()
  return (
    collectible.name.toLowerCase().includes(value) ||
    collectible.collection.name?.toLowerCase().includes(value)
  )
}

const sortCollectibles = (
  collectibles: Collectible[],
  sort?: { column: 'name' | 'collection'; direction: 'asc' | 'desc' },
) => {
  const sorted = [...collectibles]

  sorted.sort((a, b) => {
    const comparison =
      sort?.column === 'collection'
        ? (a.collection.name || '').localeCompare(b.collection.name || '') ||
          a.name.localeCompare(b.name)
        : a.name.localeCompare(b.name)

    return sort?.direction === 'desc' ? -comparison : comparison
  })

  return sorted
}

const callContract = async (to: string, data: string) => {
  return callAnvilRpc<string>('eth_call', [{ to, data }, 'latest'])
}

const isOwnedErc721 = async (address: string) => {
  try {
    const data = erc721.encodeFunctionData('ownerOf', [
      ANVIL_TEST_ERC721_TOKEN_ID,
    ])
    const result = await callContract(ANVIL_TEST_ERC721, data)
    const [owner] = erc721.decodeFunctionResult('ownerOf', result)
    return String(owner).toLowerCase() === address.toLowerCase()
  } catch {
    return false
  }
}

const getErc1155Balance = async (address: string) => {
  try {
    const data = erc1155.encodeFunctionData('balanceOf', [
      address,
      ANVIL_TEST_ERC1155_TOKEN_ID,
    ])
    const result = await callContract(ANVIL_TEST_ERC1155, data)
    const [balance] = erc1155.decodeFunctionResult('balanceOf', result)
    return BigInt(balance.toString())
  } catch {
    return 0n
  }
}

export async function getAnvilCollectiblesPage(params: {
  address: string
  search?: string
  sort?: { column: 'name' | 'collection'; direction: 'asc' | 'desc' }
}) {
  const { address, search, sort } = params
  const [ownsErc721, erc1155Balance] = await Promise.all([
    isOwnedErc721(address),
    getErc1155Balance(address),
  ])

  const collectibles: Collectible[] = []

  if (ownsErc721) {
    collectibles.push(
      cloneCollectible(
        BASE_COLLECTIBLES[
          `${ANVIL_TEST_ERC721.toLowerCase()}:${ANVIL_TEST_ERC721_TOKEN_ID}`
        ],
      ),
    )
  }

  if (erc1155Balance > 0n) {
    const collectible = cloneCollectible(
      BASE_COLLECTIBLES[
        `${ANVIL_TEST_ERC1155.toLowerCase()}:${ANVIL_TEST_ERC1155_TOKEN_ID}`
      ],
    )
    collectible.traits = {
      ...collectible.traits,
      Balance: erc1155Balance.toString(),
    }
    collectibles.push(collectible)
  }

  return {
    collectibles: sortCollectibles(
      collectibles.filter(item => matchesSearch(item, search)),
      sort,
    ),
    hasMore: false,
    pages: { ethereum: '' } as Record<NetworkType, string>,
  }
}

export async function getAnvilCollectible(params: {
  contract: string
  tokenId: string
}) {
  const key = `${params.contract.toLowerCase()}:${params.tokenId}`
  const collectible = BASE_COLLECTIBLES[key]

  if (!collectible) {
    throw new Error('Collectible not found')
  }

  return cloneCollectible(collectible)
}

export const getCollectibleContractHref = (contract: string) =>
  isAnvilTestContract(contract)
    ? undefined
    : `https://etherscan.io/address/${contract}`
