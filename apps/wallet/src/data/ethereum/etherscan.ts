// todo?: rename to provider

const ETHERSCAN_API_BASE_URL = 'https://api.etherscan.io/v2/api'

const GAS_MULTIPLIERS = {
  SAFE: 0.9,
  PROPOSE: 1.0,
  FAST: 1.2,
  BASE_FEE: 0.85,
} as const

const KNOWN_GAS_ESTIMATES = {
  ETH_TRANSFER: 21000,
  ERC20_TRANSFER: 65000,
  ERC20_APPROVE: 50000,
  ERC20_TRANSFER_FROM: 100000,
  ERC721_TRANSFER: 100000,
  ERC721_APPROVE_ALL: 80000,
  GENERIC_CONTRACT: 100000,
} as const

// Method IDs for common contract functions
const METHOD_IDS = {
  ERC20_TRANSFER: '0xa9059cbb',
  ERC20_APPROVE: '0x095ea7b3',
  ERC20_TRANSFER_FROM: '0x23b872dd',
  ERC721_TRANSFER: '0x42842e0e',
  ERC721_APPROVE_ALL: '0xa22cb465',
} as const

const CHAIN_IDS = {
  ETHEREUM: '1',
  BASE: '8453',
  OPTIMISM: '10',
} as const

const RPC_URLS = {
  [CHAIN_IDS.ETHEREUM]: [
    'https://eth.llamarpc.com',
    'https://ethereum.publicnode.com',
  ],
  [CHAIN_IDS.BASE]: ['https://base.llamarpc.com', 'https://mainnet.base.org'],
  [CHAIN_IDS.OPTIMISM]: [
    'https://optimism.llamarpc.com',
    'https://mainnet.optimism.io',
  ],
} as const

// Gas calculation constants
const GWEI_TO_WEI = 1e9
const PRIORITY_FEE_FALLBACK = 2_000_000_000n // 2 gwei in wei
const GAS_CUSHION_MULTIPLIER = 1.1
const MIN_GAS_PRICE = 1

export async function fetchGasPrice(chainId: string) {
  const params = new URLSearchParams({
    module: 'proxy',
    action: 'eth_gasPrice',
    chainid: chainId,
    apikey: import.meta.env.WXT_ETHERSCAN_API_KEY || '',
  })

  const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch fee estimates')
  }
  const { result } = await response.json()
  return result
}

async function fetchGasOracle(chainId: string) {
  const params = new URLSearchParams({
    module: 'gastracker',
    action: 'gasoracle',
    chainid: chainId,
    apikey: import.meta.env.WXT_ETHERSCAN_API_KEY || '',
  })

  const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error('Failed to fetch gas oracle')
  }

  const responseData = await response.json()

  // Check if the gasoracle endpoint is supported
  if (responseData.error || responseData.status === '0') {
    throw new Error('Gas oracle not supported for this chain')
  }

  return responseData.result
}

function createGasEstimatesFromPrice(gasPriceHex: string) {
  const gasPriceGwei = parseInt(gasPriceHex, 16) / GWEI_TO_WEI

  return {
    SafeGasPrice: Math.max(
      MIN_GAS_PRICE,
      Math.round(gasPriceGwei * GAS_MULTIPLIERS.SAFE),
    ).toString(),
    ProposeGasPrice: Math.max(
      MIN_GAS_PRICE,
      Math.round(gasPriceGwei * GAS_MULTIPLIERS.PROPOSE),
    ).toString(),
    FastGasPrice: Math.max(
      MIN_GAS_PRICE,
      Math.round(gasPriceGwei * GAS_MULTIPLIERS.FAST),
    ).toString(),
    suggestBaseFee: Math.max(
      MIN_GAS_PRICE,
      gasPriceGwei * GAS_MULTIPLIERS.BASE_FEE,
    ).toString(),
    gasUsedRatio: '0.5',
  }
}

export async function getGasOracle(chainId: string) {
  try {
    const oracleResult = await fetchGasOracle(chainId)
    return oracleResult
  } catch (error) {
    console.warn('Gas oracle failed, using eth_gasPrice fallback:', error)
    const gasPrice = await fetchGasPrice(chainId)
    return createGasEstimatesFromPrice(gasPrice)
  }
}

export async function getFeeRate(chainId: string) {
  const { suggestBaseFee, FastGasPrice } = await getGasOracle(chainId)

  const gweiToWei = (gwei: string) =>
    BigInt(Math.round(parseFloat(gwei) * GWEI_TO_WEI))
  const baseFeeWei = gweiToWei(suggestBaseFee)
  let priorityFeeWei = gweiToWei(FastGasPrice) - baseFeeWei

  if (priorityFeeWei <= 0n) priorityFeeWei = PRIORITY_FEE_FALLBACK

  const finalMaxFeePerGas = baseFeeWei + priorityFeeWei * 2n

  return {
    baseFeeWei,
    priorityFeeWei,
    finalMaxFeePerGas,
  }
}

export async function getAccountBalance(address: string, chainId: string) {
  const params = new URLSearchParams({
    module: 'account',
    action: 'balance',
    address,
    tag: 'latest',
    chainid: chainId,
    apikey: import.meta.env.WXT_ETHERSCAN_API_KEY || '',
  })

  const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`)
  if (!response.ok) throw new Error('Failed to fetch account balance')
  const responseData = await response.json()

  return responseData.result
}

function getKnownGasEstimate(data?: string): number {
  if (!data || data === '0x') {
    return KNOWN_GAS_ESTIMATES.ETH_TRANSFER
  }

  if (data.length >= 10) {
    const methodId = data.slice(0, 10)

    if (methodId === METHOD_IDS.ERC20_TRANSFER)
      return KNOWN_GAS_ESTIMATES.ERC20_TRANSFER
    if (methodId === METHOD_IDS.ERC20_APPROVE)
      return KNOWN_GAS_ESTIMATES.ERC20_APPROVE
    if (methodId === METHOD_IDS.ERC20_TRANSFER_FROM)
      return KNOWN_GAS_ESTIMATES.ERC20_TRANSFER_FROM
    if (methodId === METHOD_IDS.ERC721_TRANSFER)
      return KNOWN_GAS_ESTIMATES.ERC721_TRANSFER
    if (methodId === METHOD_IDS.ERC721_APPROVE_ALL)
      return KNOWN_GAS_ESTIMATES.ERC721_APPROVE_ALL
  }

  return KNOWN_GAS_ESTIMATES.GENERIC_CONTRACT
}

function applyCushion(gasEstimate: number): number {
  return Math.floor(gasEstimate * GAS_CUSHION_MULTIPLIER)
}

export async function estimateGas({
  from,
  to,
  value,
  data,
  chainId,
}: {
  from: string
  to: string
  value?: string
  data?: string
  chainId: string
}) {
  const params = new URLSearchParams({
    module: 'proxy',
    action: 'eth_estimateGas',
    from,
    to,
    chainid: chainId,
    apikey: import.meta.env.WXT_ETHERSCAN_API_KEY || '',
  })

  if (value) params.append('value', value)
  if (data && data !== '0x') params.append('data', data)

  try {
    const response = await fetch(
      `${ETHERSCAN_API_BASE_URL}?${params.toString()}`,
    )

    if (!response.ok) throw new Error('Failed to estimate gas')

    const responseData = await response.json()

    if (responseData.result && responseData.result !== '0x') {
      const estimateHex = parseInt(responseData.result, 16)
      const cushionedGas = applyCushion(estimateHex)
      return `0x${cushionedGas.toString(16)}`
    }

    throw new Error('Invalid gas estimation result')
  } catch (error) {
    console.warn('Gas estimation failed, using known estimates:', error)
    const knownEstimate = getKnownGasEstimate(data)
    const cushionedGas = applyCushion(knownEstimate)

    return `0x${cushionedGas.toString(16)}`
  }
}

export async function estimateGasRPC({
  from,
  to,
  value,
  data,
  chainId,
}: {
  from: string
  to: string
  value?: string
  data?: string
  chainId: string
}) {
  const getRPCUrls = (chainId: string) => {
    return (
      RPC_URLS[chainId as keyof typeof RPC_URLS] || RPC_URLS[CHAIN_IDS.ETHEREUM]
    )
  }

  const payload = {
    jsonrpc: '2.0',
    method: 'eth_estimateGas',
    params: [
      {
        from,
        to,
        ...(value && { value }),
        ...(data && data !== '0x' && { data }),
      },
    ],
    id: 1,
  }

  const urls = getRPCUrls(chainId)
  const estimates: number[] = []

  await Promise.allSettled(
    urls.map(async url => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) throw new Error('RPC request failed')

        const { result, error } = await response.json()
        if (error) throw new Error(error.message)

        const gasEstimate = parseInt(result, 16)
        if (gasEstimate > 0) estimates.push(gasEstimate)
      } catch (error) {
        console.warn(`RPC estimation failed for ${url}:`, error)
      }
    }),
  )

  if (estimates.length === 0) {
    console.warn('All RPC providers failed, falling back to Etherscan')
    return estimateGas({ from, to, value, data, chainId })
  }

  // Take the median estimate and apply 10% cushion
  estimates.sort((a, b) => a - b)
  const medianEstimate = estimates[Math.floor(estimates.length / 2)]
  const cushionedGas = applyCushion(medianEstimate)

  return `0x${cushionedGas.toString(16)}`
}

export async function getNonce(address: string, chainId: string) {
  for (const tag of ['pending', 'latest']) {
    const params = new URLSearchParams({
      module: 'proxy',
      action: 'eth_getTransactionCount',
      address,
      tag,
      chainid: chainId,
      apikey: import.meta.env.WXT_ETHERSCAN_API_KEY || '',
    })

    const response = await fetch(
      `${ETHERSCAN_API_BASE_URL}?${params.toString()}`,
    )
    if (!response.ok) continue
    const responseData = await response.json()

    if (responseData.error) {
      console.warn(
        `Etherscan API error with tag ${tag}:`,
        responseData.error.message,
      )
      continue
    }

    return responseData.result
  }

  throw new Error('Failed to fetch nonce')
}

export async function broadcastTransaction(txHex: string, chainId: string) {
  // fixme?: "typed transaction too short"
  // const response = await fetch(
  //   `https://api-holesky.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&apikey=${import.meta.env.WXT_ETHERSCAN_API_KEY}`,
  //   {
  //     method: 'POST',
  //     body: txHex,
  //   },
  // )

  const params = new URLSearchParams({
    module: 'proxy',
    action: 'eth_sendRawTransaction',
    hex: txHex,
    chainid: chainId,
    apikey: import.meta.env.WXT_ETHERSCAN_API_KEY || '',
  })

  const response = await fetch(`${ETHERSCAN_API_BASE_URL}?${params.toString()}`)

  if (!response.ok) throw new Error('Failed to broadcast transaction')

  const { result } = await response.json()
  return result
}
