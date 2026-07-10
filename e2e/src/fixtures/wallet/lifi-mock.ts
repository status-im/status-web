import { CONTRACTS } from '@helpers/anvil-rpc.js'

/**
 * Deterministic li.quest mock for the wallet swap suite.
 *
 * The exchange drawer embeds the LiFi widget, which quotes routes from li.quest.
 * We answer every li.quest endpoint the widget/SDK calls with synthetic fixtures
 * for a single supported pair: native ETH -> WETH on mainnet. The returned
 * stepTransaction calldata is a real `WETH9.deposit()` (wrap), so the swap still
 * EXECUTES for real on the Anvil fork through Status's connector -> signer ->
 * background-SW -> broadcast path, and the output token lands 1:1 on-chain
 * (assertable via balanceOf). Only the quote/route/status plumbing is faked.
 *
 * Notes on fee realism: the transactionRequest deliberately carries only a
 * gasLimit — no maxFeePerGas — so the wallet's signer falls back to its own
 * fee estimation (nodes.getFeeRate -> fork eth_feeHistory). Congestion set on
 * Anvil is therefore still reflected in what the swap actually pays.
 */

const NATIVE_ETH = '0x0000000000000000000000000000000000000000'
const WETH_DEPOSIT_CALLDATA = '0xd0e30db0' // WETH9.deposit() selector
const ETH_PRICE_USD = 2_000

const ethToken = {
  address: NATIVE_ETH,
  chainId: 1,
  symbol: 'ETH',
  decimals: 18,
  name: 'ETH',
  coinKey: 'ETH',
  logoURI: '',
  priceUSD: String(ETH_PRICE_USD),
}

const wethToken = {
  address: CONTRACTS.WETH,
  chainId: 1,
  symbol: 'WETH',
  decimals: 18,
  name: 'Wrapped Ether',
  coinKey: 'WETH',
  logoURI: '',
  priceUSD: String(ETH_PRICE_USD),
}

const toolDetails = { key: 'wrapped', name: 'WrapEth', logoURI: '' }

/** ExtendedChain for Ethereum mainnet — the only chain the drawer allows. */
const ethereumChain = {
  key: 'eth',
  chainType: 'EVM',
  name: 'Ethereum',
  coin: 'ETH',
  id: 1,
  mainnet: true,
  logoURI: '',
  multicallAddress: '0xcA11bde05977b3631167028862bE2a173976CA11',
  metamask: {
    chainId: '0x1',
    blockExplorerUrls: ['https://etherscan.io/'],
    chainName: 'Ethereum Mainnet',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://ethereum-rpc.publicnode.com'],
  },
  nativeToken: ethToken,
}

const usd = (weiAmount: bigint): string =>
  ((Number(weiAmount) / 1e18) * ETH_PRICE_USD).toFixed(2)

/** LiFiStep for wrapping `fromAmount` wei of ETH into WETH. */
const buildStep = (fromAmount: string, fromAddress: string) => {
  const amountUSD = usd(BigInt(fromAmount))
  const action = {
    fromChainId: 1,
    fromAmount,
    fromToken: ethToken,
    fromAddress,
    toChainId: 1,
    toToken: wethToken,
    toAddress: fromAddress,
    slippage: 0.005,
  }
  const estimate = {
    tool: 'custom',
    fromAmount,
    fromAmountUSD: amountUSD,
    toAmount: fromAmount, // wrap is 1:1
    toAmountMin: fromAmount,
    toAmountUSD: amountUSD,
    approvalAddress: NATIVE_ETH,
    executionDuration: 30,
    feeCosts: [],
    gasCosts: [
      {
        type: 'SEND',
        price: '1000000000', // 1 gwei — display only; real fee comes from the fork
        estimate: '48000',
        limit: '60000',
        amount: '48000000000000',
        amountUSD: '0.10',
        token: ethToken,
      },
    ],
  }
  return {
    id: 'e2e-lifi-step-1',
    type: 'lifi',
    // 'custom' matters: the SDK's status poll omits the `bridge` param for it.
    tool: 'custom',
    toolDetails,
    integrator: 'StatusWallet',
    action,
    estimate,
    includedSteps: [
      {
        id: 'e2e-included-step-1',
        type: 'swap',
        tool: 'custom',
        toolDetails,
        action,
        estimate: { ...estimate, feeCosts: undefined, gasCosts: undefined },
      },
    ],
  }
}

const buildRoute = (fromAmount: string, fromAddress: string) => {
  const amountUSD = usd(BigInt(fromAmount))
  return {
    id: 'e2e-lifi-route-1',
    insurance: { state: 'NOT_INSURABLE', feeAmountUsd: '0' },
    fromChainId: 1,
    fromAmountUSD: amountUSD,
    fromAmount,
    fromToken: ethToken,
    fromAddress,
    toChainId: 1,
    toAmountUSD: amountUSD,
    toAmount: fromAmount,
    toAmountMin: fromAmount,
    toToken: wethToken,
    toAddress: fromAddress,
    gasCostUSD: '0.10',
    steps: [buildStep(fromAmount, fromAddress)],
    tags: ['RECOMMENDED', 'CHEAPEST', 'FASTEST'],
  }
}

export interface LifiMockResponse {
  status: number
  body: unknown
}

export interface LifiMock {
  /** Answer an intercepted li.quest request. */
  handle: (
    rawUrl: string,
    method: string,
    postData: string | null,
  ) => LifiMockResponse
}

const isWeth = (address: unknown): boolean =>
  typeof address === 'string' &&
  address.toLowerCase() === CONTRACTS.WETH.toLowerCase()

export function createLifiMock(): LifiMock {
  // The last quoted amount/address, echoed into the /status response (the SDK's
  // status poll only carries the txHash, not the amounts).
  let lastFromAmount = '0'
  let lastFromAddress = NATIVE_ETH

  const handle = (
    rawUrl: string,
    method: string,
    postData: string | null,
  ): LifiMockResponse => {
    const url = new URL(rawUrl)
    const path = url.pathname

    if (path === '/v1/chains') {
      return { status: 200, body: { chains: [ethereumChain] } }
    }

    if (path === '/v1/tokens') {
      return { status: 200, body: { tokens: { '1': [ethToken, wethToken] } } }
    }

    if (path === '/v1/token') {
      const token = url.searchParams.get('token') ?? ''
      const match = isWeth(token) || /weth/i.test(token) ? wethToken : ethToken
      return { status: 200, body: match }
    }

    if (path === '/v1/tools') {
      return { status: 200, body: { bridges: [], exchanges: [toolDetails] } }
    }

    if (path === '/v1/connections') {
      return { status: 200, body: { connections: [] } }
    }

    // Wallet token balances. An empty map is valid — the widget falls back to
    // reading balances over RPC (-> proxy -> fork), which is what we want.
    if (/^\/v1\/wallets\/[^/]+\/balances$/.test(path)) {
      return { status: 200, body: { balances: {} } }
    }

    if (path.startsWith('/v1/gas/suggestion')) {
      return { status: 200, body: { available: false } }
    }

    if (path === '/v1/advanced/routes' && method === 'POST') {
      const request = JSON.parse(postData ?? '{}') as {
        fromAmount?: string
        fromAddress?: string
        fromTokenAddress?: string
        toTokenAddress?: string
      }
      // Only the ETH -> WETH pair is quotable; anything else has no route.
      const supported =
        request.fromTokenAddress === NATIVE_ETH &&
        isWeth(request.toTokenAddress) &&
        !!request.fromAmount &&
        !!request.fromAddress
      const routes = supported
        ? [buildRoute(request.fromAmount!, request.fromAddress!)]
        : []
      return {
        status: 200,
        body: { routes, unavailableRoutes: { filteredOut: [], failed: [] } },
      }
    }

    if (path === '/v1/advanced/stepTransaction' && method === 'POST') {
      const step = JSON.parse(postData ?? '{}') as {
        action?: { fromAmount?: string; fromAddress?: string }
      }
      const fromAmount = step.action?.fromAmount ?? '0'
      const fromAddress = step.action?.fromAddress ?? NATIVE_ETH
      lastFromAmount = fromAmount
      lastFromAddress = fromAddress
      return {
        status: 200,
        body: {
          ...buildStep(fromAmount, fromAddress),
          transactionRequest: {
            chainId: 1,
            to: CONTRACTS.WETH,
            from: fromAddress,
            data: WETH_DEPOSIT_CALLDATA,
            value: '0x' + BigInt(fromAmount).toString(16),
            gasLimit: '0xea60', // 60k — deposit() uses ~28k
          },
        },
      }
    }

    if (path === '/v1/status') {
      // The tx executed for real on the fork (the SDK already awaited the
      // receipt before polling here), so we can unconditionally report DONE.
      const txHash = url.searchParams.get('txHash') ?? '0x0'
      const txLink = `https://etherscan.io/tx/${txHash}`
      const transactionInfo = {
        txHash,
        chainId: 1,
        txLink,
        amount: lastFromAmount,
        amountUSD: usd(BigInt(lastFromAmount)),
        gasPrice: '1000000000',
        gasUsed: '28000',
        gasToken: ethToken,
        gasAmount: '28000000000000',
        gasAmountUSD: '0.06',
        timestamp: Math.floor(Date.now() / 1000),
      }
      return {
        status: 200,
        body: {
          transactionId: 'e2e-lifi-transfer-1',
          status: 'DONE',
          substatus: 'COMPLETED',
          substatusMessage: 'The transfer is complete.',
          tool: 'custom',
          fromAddress: lastFromAddress,
          toAddress: lastFromAddress,
          metadata: { integrator: 'StatusWallet' },
          feeCosts: [],
          lifiExplorerLink: txLink,
          sending: { ...transactionInfo, token: ethToken },
          receiving: { ...transactionInfo, token: wethToken },
        },
      }
    }

    console.log(`[lifi-mock] un-mocked li.quest request: ${method} ${rawUrl}`)
    return { status: 404, body: { message: `not mocked: ${path}` } }
  }

  return { handle }
}
