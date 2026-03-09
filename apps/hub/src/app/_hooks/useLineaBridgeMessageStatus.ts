import { useQuery } from '@tanstack/react-query'
import {
  type Address,
  createPublicClient,
  decodeEventLog,
  type Hex,
  http,
  parseAbiItem,
} from 'viem'
import { linea, mainnet, statusSepolia } from 'viem/chains'

import { RPC_URLS } from '~constants/chain'

import type { Vault } from '~constants/address'

// ============================================================================
// Types
// ============================================================================

export type BridgeMessageStatus =
  | 'unknown' // no unlock tx yet
  | 'pending' // message sent on L1, not yet claimable on L2
  | 'claimable' // message arrived on L2, can be claimed
  | 'claimed' // already claimed

// ============================================================================
// ABI fragments
// ============================================================================

const messageSentEvent = parseAbiItem(
  'event MessageSent(address indexed _from, address indexed _to, uint256 _fee, uint256 _value, uint256 _nonce, bytes _calldata, bytes32 indexed _messageHash)'
)

const inboxL1L2MessageStatusAbi = [
  {
    name: 'inboxL1L2MessageStatus',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_messageHash', type: 'bytes32' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

// OnChainMessageStatus enum: 0 = UNKNOWN, 1 = CLAIMABLE, 2 = CLAIMED
const MESSAGE_STATUS = {
  UNKNOWN: 0n,
  CLAIMABLE: 1n,
  CLAIMED: 2n,
} as const

// ============================================================================
// Helpers
// ============================================================================

type MessageServiceConfig = {
  l1ContractAddress: Address
  l2ContractAddress: Address
  l1RpcUrl: string
  l2RpcUrl: string
}

function getMessageServiceConfig(
  l1ChainId: number
): MessageServiceConfig | null {
  switch (l1ChainId) {
    case mainnet.id:
      return {
        l1ContractAddress: '0xd19d4B5d358258f05D7B411E21A1460D11B0876F',
        l2ContractAddress: '0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec',
        l1RpcUrl: RPC_URLS[mainnet.id],
        l2RpcUrl: RPC_URLS[statusSepolia.id],
      }
    case linea.id:
      return {
        l1ContractAddress: '0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec',
        l2ContractAddress: '0x508Ca82Df566dCD1B0DE8296e70a96332cD644ec',
        l1RpcUrl: RPC_URLS[linea.id],
        l2RpcUrl: RPC_URLS[statusSepolia.id],
      }
    default:
      return null
  }
}

async function checkMessageStatus(
  config: MessageServiceConfig,
  unlockTxHash: Hex
): Promise<BridgeMessageStatus> {
  const l1Client = createPublicClient({
    transport: http(config.l1RpcUrl),
  })

  // Get the tx receipt to find MessageSent events
  const receipt = await l1Client.getTransactionReceipt({
    hash: unlockTxHash,
  })

  // Parse MessageSent events only from the L1 message service contract
  const messageHashes: Hex[] = []
  for (const log of receipt.logs) {
    if (log.address.toLowerCase() !== config.l1ContractAddress.toLowerCase()) {
      continue
    }
    try {
      const decoded = decodeEventLog({
        abi: [messageSentEvent],
        data: log.data,
        topics: log.topics,
      })
      if (decoded.eventName === 'MessageSent') {
        messageHashes.push(decoded.args._messageHash)
      }
    } catch {
      // Not a MessageSent event, skip
    }
  }

  if (messageHashes.length === 0) {
    return 'unknown'
  }

  // Check status of the first message on L2
  const l2Client = createPublicClient({
    transport: http(config.l2RpcUrl),
  })

  const status = await l2Client.readContract({
    address: config.l2ContractAddress,
    abi: inboxL1L2MessageStatusAbi,
    functionName: 'inboxL1L2MessageStatus',
    args: [messageHashes[0]],
  })

  if (status === MESSAGE_STATUS.CLAIMED) return 'claimed'
  if (status === MESSAGE_STATUS.CLAIMABLE) return 'claimable'
  return 'pending'
}

// ============================================================================
// Hook
// ============================================================================

type UseLineaBridgeMessageStatusParams = {
  vault: Vault
  unlockTxHash: string | null
}

/**
 * Tracks the status of an L1→L2 bridge message after an unlock transaction.
 *
 * Uses viem to read MessageSent events from L1 and check delivery status on L2.
 */
export function useLineaBridgeMessageStatus({
  vault,
  unlockTxHash,
}: UseLineaBridgeMessageStatusParams) {
  return useQuery<BridgeMessageStatus>({
    queryKey: ['linea-bridge-message-status', vault.id, unlockTxHash],
    queryFn: async () => {
      if (!unlockTxHash) return 'unknown'

      const config = getMessageServiceConfig(vault.chainId)
      if (!config) return 'unknown'

      return checkMessageStatus(config, unlockTxHash as Hex)
    },
    enabled: !!unlockTxHash,
    refetchInterval: query => {
      const status = query.state.data
      if (status === 'claimed' || status === 'claimable') return false
      return 30_000
    },
    staleTime: 10_000,
  })
}
