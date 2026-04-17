import { formatEther } from 'ethers'

export const ANVIL_RPC_URL = 'http://127.0.0.1:8545'
export const ANVIL_CHAIN_ID = '31337'
export const ANVIL_TEST_MNEMONIC =
  'test test test test test test test test test test test junk'
export const ANVIL_TEST_SENDER = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
export const ANVIL_TEST_RECIPIENT = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8'
export const ANVIL_TEST_ERC721 = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
export const ANVIL_TEST_ERC1155 = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
export const ANVIL_TEST_ERC721_TOKEN_ID = '0'
export const ANVIL_TEST_ERC1155_TOKEN_ID = '1'

export type AnvilGasFees = {
  feeEth: number
  feeEur: number
  maxFeeEth: number
  maxFeeEur: number
  confirmationTime: string
  txParams: {
    gasLimit: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
  }
}

type JsonRpcError = {
  code?: number
  message?: string
  data?: unknown
}

const extractRpcErrorMessage = (error: JsonRpcError) => {
  if (typeof error.data === 'string') {
    return error.data
  }

  if (
    typeof error.data === 'object' &&
    error.data !== null &&
    'message' in error.data &&
    typeof error.data.message === 'string'
  ) {
    return error.data.message
  }

  return error.message || 'Anvil RPC request failed'
}

export async function callAnvilRpc<T>(
  method: string,
  params: unknown[] = [],
): Promise<T> {
  const response = await fetch(ANVIL_RPC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: crypto.randomUUID(),
      method,
      params,
    }),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Anvil RPC request failed: ${response.statusText}`)
  }

  const body = (await response.json()) as {
    result?: T
    error?: JsonRpcError
  }

  if (body.error) {
    throw new Error(extractRpcErrorMessage(body.error))
  }

  if (typeof body.result === 'undefined') {
    throw new Error(`Missing result for ${method}`)
  }

  return body.result
}

export async function fetchAnvilEthBalance(address: string): Promise<number> {
  const balanceHex = await callAnvilRpc<string>('eth_getBalance', [
    address,
    'latest',
  ])

  return Number(formatEther(BigInt(balanceHex)))
}

export async function estimateAnvilGasFees(
  params: Record<string, unknown>,
): Promise<AnvilGasFees> {
  const [gasLimitHex, maxPriorityFeePerGasHex, latestBlock] = await Promise.all(
    [
      callAnvilRpc<string>('eth_estimateGas', [params]),
      callAnvilRpc<string>('eth_maxPriorityFeePerGas'),
      callAnvilRpc<{ baseFeePerGas?: string }>('eth_getBlockByNumber', [
        'latest',
        false,
      ]),
    ],
  )

  const gasLimit = BigInt(gasLimitHex)
  const maxPriorityFeePerGas = BigInt(maxPriorityFeePerGasHex)
  const baseFeePerGas = BigInt(latestBlock.baseFeePerGas ?? '0x0')
  const maxFeePerGas =
    baseFeePerGas > 0n
      ? baseFeePerGas * 2n + maxPriorityFeePerGas
      : maxPriorityFeePerGas || 1_500_000_000n
  const maxFeeEth = Number(formatEther(gasLimit * maxFeePerGas))

  return {
    feeEth: maxFeeEth,
    feeEur: 0,
    maxFeeEth,
    maxFeeEur: 0,
    confirmationTime: '~1s',
    txParams: {
      gasLimit: `0x${gasLimit.toString(16)}`,
      maxFeePerGas: `0x${maxFeePerGas.toString(16)}`,
      maxPriorityFeePerGas: `0x${maxPriorityFeePerGas.toString(16)}`,
    },
  }
}

export const isAnvilTestContract = (address: string) => {
  const normalized = address.toLowerCase()
  return (
    normalized === ANVIL_TEST_ERC721.toLowerCase() ||
    normalized === ANVIL_TEST_ERC1155.toLowerCase()
  )
}
