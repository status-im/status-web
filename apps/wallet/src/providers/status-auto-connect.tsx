import { useEffect, useRef } from 'react'

import { useAccount, useConnect } from 'wagmi'

import { useAPI } from './api-client'
import { useWallet } from './wallet-context'

// Constants
const DEFAULT_CHAIN_ID = 1 // mainnet
const PROVIDER_SETUP_DELAY = 100
const PROVIDER_SETUP_EXTENDED_DELAY = 500
const STATUS_PROVIDER_UUID = 'c14d6a7e-14c2-477d-bcb7-ffb732145eae'
const STATUS_PROVIDER_ICON =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzk1MF8xMjM5NikiPiA8bWFzayBpZD0ibWFzazBfOTUwXzEyMzk2IiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSItMSIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMzIj4gPHBhdGggZD0iTTE2IC0wLjAwMDQ4ODI4MUM0IC0wLjAwMDQ4ODI4MSAwIDMuOTk5NTEgMCAxNS45OTk1QzAgMjcuOTk5NSA0IDMxLjk5OTUgMTYgMzEuOTk5NUMyOCAzMS45OTk1IDMyIDI3Ljk5OTUgMzIgMTUuOTk5NUMzMiAzLjk5OTUxIDI4IC0wLjAwMDQ4ODI4MSAxNiAtMC4wMDA0ODgyODFaIiBmaWxsPSJ3aGl0ZSIvPiA8L21hc2s+IDxnIG1hc2s9InVybCgjbWFzazBfOTUwXzEyMzk2KSI+IDxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2ZfOTUwXzEyMzk2KSI+IDxjaXJjbGUgY3g9IjIzIiBjeT0iOC45OTk1MSIgcj0iMTkiIGZpbGw9IiMxOTkyRDciLz4gPC9nPiA8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMV9mXzk1MF8xMjM5NikiPiA8Y2lyY2xlIGN4PSIzMyIgY3k9IjE4Ljk5OTUiIHI9IjE5IiBmaWxsPSIjRjZCMDNDIi8+IDwvZz4gPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjJfZl85NTBfMTIzOTYpIj4gPGNpcmNsZSBjeD0iNSIgY3k9IjMwLjk5OTUiIHI9IjE5IiBmaWxsPSIjRkY3RDQ2Ii8+IDwvZz4gPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjNfZl85NTBfMTIzOTYpIj4gPGNpcmNsZSBjeD0iLTciIGN5PSI4Ljk5OTUxIiByPSIxOSIgZmlsbD0iIzcxNDBGRCIvPiA8L2c+IDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTguMTI4NCA4LjgwODQzQzE0Ljk1NTEgOC45ODk4NCAxMi42MTIxIDExLjg3NDMgMTIuMzUxNiAxNS4xMzc1QzEyLjM2NzYgMTUuMTMyNiAxMi4zODUzIDE1LjEyNzYgMTIuNDAzIDE1LjEyMjdDMTIuNDIwNyAxNS4xMTc4IDEyLjQzODQgMTUuMTEyOSAxMi40NTQ0IDE1LjEwOEMxMi44NTM1IDE1LjAwNjcgMTMuMjYxNyAxNC45NDUyIDEzLjY3MzEgMTQuOTI0M0MxNC41NjQxIDE0Ljg3NDUgMTUuMjg4NyAxNC45NTE2IDE2LjAxMzIgMTUuMDI4OEMxNi43Mzg3IDE1LjEwNiAxNy40NjQgMTUuMTgzMiAxOC4zNTYyIDE1LjEzMjlDMTguNzY1OCAxNS4xMTEzIDE5LjE3MjIgMTUuMDQ3OSAxOS41Njg4IDE0Ljk0NEMyMS4yNDc2IDE0LjUwODYgMjIuMjEzNSAxMy4zNzQgMjIuMTI4MiAxMS44MTkxQzIyLjAyMzEgOS44ODcwOCAyMC4wNzY5IDguNjk3MzIgMTguMTI4NCA4LjgwODQzWk0xMy44Nzk2IDIzLjE5MDlDMTcuMDUyOSAyMy4wMDk1IDE5LjM5NTkgMjAuMTI1IDE5LjY1NjQgMTYuODYxOEMxOS42MzYzIDE2Ljg2OCAxOS42MTM1IDE2Ljg3NDIgMTkuNTkxNSAxNi44ODAxQzE5LjU3ODQgMTYuODgzNyAxOS41NjU1IDE2Ljg4NzIgMTkuNTUzNiAxNi44OTA1QzE5LjE1NDUgMTYuOTkxOSAxOC43NDYyIDE3LjA1MzQgMTguMzM0OCAxNy4wNzQyQzE3LjQ0MjcgMTcuMTI0OSAxNi43MTczIDE3LjA0NzkgMTUuOTkxOSAxNi45NzA4QzE1LjI2NzQgMTYuODkzOCAxNC41NDI4IDE2LjgxNjkgMTMuNjUxOCAxNi44NjcxQzEzLjI0MjEgMTYuODg4OCAxMi44MzU4IDE2Ljk1MjEgMTIuNDM5MiAxNy4wNTYxQzEwLjc2MDMgMTcuNDkwNyA5Ljc5ODI5IDE4LjYyNTMgOS44Nzk3OSAyMC4xODAyQzkuOTg0OTEgMjIuMTEyMiAxMS45MzExIDIzLjMwMiAxMy44Nzk2IDIzLjE5MDlaIiBmaWxsPSJ3aGl0ZSIvPiA8L2c+IDwvZz4gPGRlZnM+IDxmaWx0ZXIgaWQ9ImZpbHRlcjBfZl85NTBfMTIzOTYiIHg9Ii01LjQzMDI2IiB5PSItMTkuNDMwNyIgd2lkdGg9IjU2Ljg2MDUiIGhlaWdodD0iNTYuODYwNSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPiA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPiA8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPiA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0LjcxNTEzIiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfOTUwXzEyMzk2Ii8+IDwvZmlsdGVyPiA8ZmlsdGVyIGlkPSJmaWx0ZXIxX2ZfOTUwXzEyMzk2IiB4PSI0LjU2OTc0IiB5PSItOS40MzA3NSIgd2lkdGg9IjU2Ljg2MDUiIGhlaWdodD0iNTYuODYwNSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPiA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPiA8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPiA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0LjcxNTEzIiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfOTUwXzEyMzk2Ii8+IDwvZmlsdGVyPiA8ZmlsdGVyIGlkPSJmaWx0ZXIyX2ZfOTUwXzEyMzk2IiB4PSItMjMuNDMwMyIgeT0iMi41NjkyNSIgd2lkdGg9IjU2Ljg2MDUiIGhlaWdodD0iNTYuODYwNSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPiA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPiA8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPiA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0LjcxNTEzIiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfOTUwXzEyMzk2Ii8+IDwvZmlsdGVyPiA8ZmlsdGVyIGlkPSJmaWx0ZXIzX2ZfOTUwXzEyMzk2IiB4PSItMzUuNDMwMyIgeT0iLTE5LjQzMDciIHdpZHRoPSI1Ni44NjA1IiBoZWlnaHQ9IjU2Ljg2MDUiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4gPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4gPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4gPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNC43MTUxMyIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzk1MF8xMjM5NiIvPiA8L2ZpbHRlcj4gPGNsaXBQYXRoIGlkPSJjbGlwMF85NTBfMTIzOTYiPiA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IndoaXRlIi8+IDwvY2xpcFBhdGg+IDwvZGVmcz4gPC9zdmc+'

// Types
interface TransactionParams {
  from?: string
  to?: string
  value?: string
  data?: string
  gas?: string
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

interface EthereumProvider {
  isMetaMask: boolean
  isStatus: boolean
  selectedAddress: string | null
  chainId: string
  networkVersion: string
  isConnected: () => boolean
  _state: {
    isConnected: boolean
    isUnlocked: boolean
    initialized: boolean
    accounts: string[]
  }
  _metamask: {
    isUnlocked: () => Promise<boolean>
  }
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
  on: (event: string, listener: (...args: unknown[]) => void) => void
  removeListener: (
    event: string,
    listener: (...args: unknown[]) => void,
  ) => void
  addListener: (event: string, listener: (...args: unknown[]) => void) => void
  off: (event: string, listener: (...args: unknown[]) => void) => void
  emit: (event: string, ...args: unknown[]) => void
}

// Helper functions
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as Record<string, unknown>).message)
  }
  return 'Unknown error'
}

const validateAddress = (address: string, walletAddress?: string): boolean => {
  if (!walletAddress) return false
  return address.toLowerCase() === walletAddress.toLowerCase()
}

const formatChainId = (chainId: number): string => `0x${chainId.toString(16)}`

const promptUserPassword = (message: string): string | null => {
  const password = prompt(message)
  if (!password) return null
  return password
}

const getCurrentWalletId = (): string => {
  return (
    (window as unknown as { __statusWallet_currentWalletId?: string })
      .__statusWallet_currentWalletId || ''
  )
}

// RPC method handlers
const handleAccountRequests = (walletAddress?: string): string[] => {
  return walletAddress ? [walletAddress] : []
}

const handleChainId = (chainId: number): string => formatChainId(chainId)

const handleNetworkVersion = (chainId: number): string => String(chainId)

const handleSendTransaction = async (
  params: unknown[],
  walletAddress: string,
  chainId: number,
  apiClient: ReturnType<typeof useAPI>,
): Promise<string> => {
  if (!Array.isArray(params) || params.length === 0) {
    throw new Error('Invalid transaction parameters')
  }

  const txParams = params[0] as TransactionParams

  if (!txParams.from || !validateAddress(txParams.from, walletAddress)) {
    throw new Error('Transaction from address does not match connected wallet')
  }

  if (!txParams.to) {
    throw new Error('Transaction to address is required')
  }

  const password = promptUserPassword(
    'Enter your wallet password to sign the transaction:',
  )
  if (!password) {
    throw new Error(
      'Transaction cancelled: Password is required to sign transaction',
    )
  }

  const apiParams = {
    walletId: getCurrentWalletId(),
    password,
    fromAddress: txParams.from,
    toAddress: txParams.to,
    amount: txParams.value ? BigInt(txParams.value).toString() : '0',
    chainId: formatChainId(chainId),
    data: txParams.data,
  }

  const result = await apiClient.wallet.account.ethereum.send.mutate(apiParams)
  return result.id.txid
}

const handleSignTypedData = async (
  params: unknown[],
  walletAddress: string,
  apiClient: ReturnType<typeof useAPI>,
): Promise<string> => {
  if (!Array.isArray(params) || params.length < 2) {
    throw new Error('Invalid params: address and typed data required')
  }

  const [from, typedDataRaw] = params as [string, unknown]

  if (!validateAddress(from, walletAddress)) {
    throw new Error('Address mismatch with connected wallet')
  }

  const password = promptUserPassword(
    'Enter your wallet password to sign data:',
  )
  if (!password) {
    throw new Error('Signing cancelled: Password required')
  }

  const typedDataJSON =
    typeof typedDataRaw === 'string'
      ? typedDataRaw
      : JSON.stringify(typedDataRaw)

  const result = await apiClient.wallet.account.ethereum.signTypedData.mutate({
    walletId: getCurrentWalletId(),
    password,
    fromAddress: walletAddress,
    typedData: typedDataJSON,
  })

  return result.signature
}

const handleSwitchChain = (
  params: unknown[],
  currentChainId: number,
  provider: EthereumProvider,
): { newChainId: number } | null => {
  const chainParams = (params?.[0] || {}) as { chainId?: string }

  if (!chainParams.chainId) {
    throw new Error('chainId required')
  }

  const requestedHex = chainParams.chainId.toLowerCase()
  const requestedDec = parseInt(requestedHex, 16)

  if (requestedDec === currentChainId) return null

  // Update provider state
  provider.chainId = requestedHex
  provider.networkVersion = String(requestedDec)

  // Emit events
  provider.emit('chainChanged', requestedHex)
  provider.emit('connect', { chainId: requestedHex })

  return { newChainId: requestedDec }
}

const createEthereumProvider = (
  walletAddress?: string,
  initChainId: number = DEFAULT_CHAIN_ID,
  apiClient?: ReturnType<typeof useAPI>,
): EthereumProvider => {
  const hasWallet = !!walletAddress
  let currentChainId = initChainId

  const eventListeners: Record<string, ((...args: unknown[]) => void)[]> = {}

  const provider: EthereumProvider = {
    isMetaMask: false,
    isStatus: true,
    selectedAddress: walletAddress || null,
    chainId: formatChainId(currentChainId),
    networkVersion: String(currentChainId),
    isConnected: () => hasWallet,
    _state: {
      isConnected: hasWallet,
      isUnlocked: hasWallet,
      initialized: true,
      accounts: walletAddress ? [walletAddress] : [],
    },
    _metamask: {
      isUnlocked: () => Promise.resolve(hasWallet),
    },

    request: async (args: { method: string; params?: unknown[] }) => {
      if (!apiClient) throw new Error('API client not available')

      try {
        switch (args.method) {
          case 'eth_accounts':
          case 'eth_requestAccounts':
            return handleAccountRequests(walletAddress)

          case 'eth_chainId':
            return handleChainId(currentChainId)

          case 'net_version':
            return handleNetworkVersion(currentChainId)

          case 'eth_sendTransaction': {
            if (!walletAddress) throw new Error('No wallet connected')
            const txHash = await handleSendTransaction(
              args.params || [],
              walletAddress,
              currentChainId,
              apiClient,
            )
            // Emit account change after transaction
            setTimeout(
              () => provider.emit('accountsChanged', [walletAddress]),
              PROVIDER_SETUP_DELAY,
            )
            return txHash
          }

          case 'eth_signTypedData_v4': {
            if (!walletAddress) throw new Error('No wallet connected')
            return handleSignTypedData(
              args.params || [],
              walletAddress,
              apiClient,
            )
          }

          case 'wallet_switchEthereumChain': {
            const result = handleSwitchChain(
              args.params || [],
              currentChainId,
              provider,
            )
            if (result) currentChainId = result.newChainId
            return null
          }

          case 'wallet_addEthereumChain':
          case 'wallet_requestPermissions':
            return walletAddress ? [{ parentCapability: 'eth_accounts' }] : []

          case 'wallet_getPermissions':
            return walletAddress ? [{ parentCapability: 'eth_accounts' }] : []

          case 'eth_coinbase':
            return walletAddress || null

          case 'net_listening':
            return true

          case 'web3_clientVersion':
            return 'Status/1.0.0'

          default:
            throw new Error(`Method ${args.method} not supported`)
        }
      } catch (error) {
        const message = getErrorMessage(error)
        throw new Error(
          message.includes('Transaction failed')
            ? message
            : `${args.method} failed: ${message}`,
        )
      }
    },

    on: (event: string, listener: (...args: unknown[]) => void) => {
      if (!eventListeners[event]) eventListeners[event] = []
      eventListeners[event].push(listener)
    },

    removeListener: (event: string, listener: (...args: unknown[]) => void) => {
      const listeners = eventListeners[event]
      if (!listeners) return

      const index = listeners.indexOf(listener)
      if (index > -1) listeners.splice(index, 1)
    },

    addListener: (event: string, listener: (...args: unknown[]) => void) => {
      provider.on(event, listener)
    },

    off: (event: string, listener: (...args: unknown[]) => void) => {
      provider.removeListener(event, listener)
    },

    emit: (event: string, ...args: unknown[]) => {
      eventListeners[event]?.forEach(listener => listener(...args))
    },
  }

  return provider
}

const announceProvider = (provider: EthereumProvider) => {
  window.dispatchEvent(new Event('ethereum#initialized'))
  window.dispatchEvent(
    new CustomEvent('eip6963:announceProvider', {
      detail: {
        info: {
          uuid: STATUS_PROVIDER_UUID,
          name: 'Status',
          rdns: 'app.status',
          icon: STATUS_PROVIDER_ICON,
        },
        provider: provider as unknown,
      },
    }),
  )
}

const emitProviderEvents = (
  provider: EthereumProvider,
  address: string,
  chainId: number,
) => {
  const formattedChainId = formatChainId(chainId)
  provider.emit('connect', { chainId: formattedChainId })
  provider.emit('accountsChanged', [address])
  provider.emit('chainChanged', formattedChainId)
}

export function StatusAutoConnect() {
  const { currentWallet } = useWallet()
  const { connect, connectors } = useConnect()
  const { isConnected, chainId } = useAccount()
  const apiClient = useAPI()
  const providerSetupRef = useRef(false)

  // Setup ethereum provider once
  useEffect(() => {
    if (providerSetupRef.current) return
    providerSetupRef.current = true

    const initialProvider = createEthereumProvider(
      undefined,
      chainId || DEFAULT_CHAIN_ID,
      apiClient,
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).ethereum = initialProvider

    announceProvider(initialProvider)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__statusWallet = {
      createEthereumProvider: (walletAddress?: string, initChainId?: number) =>
        createEthereumProvider(walletAddress, initChainId, apiClient),
      announceProvider,
    }
  }, [chainId, apiClient])

  // Update provider when wallet changes
  useEffect(() => {
    const address = currentWallet?.activeAccounts[0]?.address
    if (!address) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statusWallet = (window as any).__statusWallet
    if (!statusWallet) return

    const updatedProvider = statusWallet.createEthereumProvider(
      address,
      chainId || DEFAULT_CHAIN_ID,
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).ethereum = updatedProvider

    // Store current wallet ID for transaction signing
    ;(
      window as unknown as { __statusWallet_currentWalletId?: string }
    ).__statusWallet_currentWalletId = currentWallet?.id

    const emitEvents = () =>
      emitProviderEvents(updatedProvider, address, chainId || DEFAULT_CHAIN_ID)
    emitEvents()
    setTimeout(emitEvents, PROVIDER_SETUP_DELAY)
    setTimeout(emitEvents, PROVIDER_SETUP_EXTENDED_DELAY)

    statusWallet.announceProvider(updatedProvider)

    // Auto-connect if not already connected
    if (!isConnected) {
      const injectedConnector = connectors.find(c => c.id === 'injected')
      if (injectedConnector) connect({ connector: injectedConnector })
    }
  }, [
    currentWallet?.activeAccounts,
    currentWallet?.id,
    isConnected,
    connectors,
    connect,
    chainId,
  ])

  return null
}
