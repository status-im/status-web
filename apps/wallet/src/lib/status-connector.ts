import {
  type Address,
  createPublicClient,
  type Hex,
  http,
  numberToHex,
} from 'viem'
import { createConnector } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export type StatusConnectorOptions = {
  getAddress: () => Address | undefined
  signAndSendTransaction: (tx: {
    to: Address
    value: bigint
    data?: Hex
    gas?: bigint
    maxFeePerGas?: bigint
    maxPriorityFeePerGas?: bigint
  }) => Promise<Hex>
  signMessage: (message: Hex) => Promise<Hex>
  signTypedData: (typedData: string) => Promise<Hex>
}

function handleProviderRequest(
  method: string,
  params: unknown[] | undefined,
  options: {
    getAddress: () => Address | undefined
    signAndSendTransaction: StatusConnectorOptions['signAndSendTransaction']
    signMessage: StatusConnectorOptions['signMessage']
    signTypedData: StatusConnectorOptions['signTypedData']
    emitter: { emit: (event: string, ...args: unknown[]) => void }
  },
): Promise<unknown> {
  const {
    getAddress,
    signAndSendTransaction,
    signMessage,
    signTypedData,
    emitter,
  } = options
  const address = getAddress()

  switch (method) {
    case 'eth_requestAccounts':
    case 'eth_accounts': {
      const accounts = address ? [address] : []
      if (method === 'eth_requestAccounts' && accounts.length > 0) {
        emitter.emit('connect', {
          accounts,
          chainId: mainnet.id,
        })
      }
      return Promise.resolve(accounts)
    }

    case 'eth_chainId':
      return Promise.resolve(numberToHex(mainnet.id))

    case 'eth_sendTransaction': {
      const txParams = (params as Record<string, unknown>[])?.[0]
      if (!txParams) throw new Error('No transaction params')

      return signAndSendTransaction({
        to: txParams.to as Address,
        value: txParams.value ? BigInt(txParams.value as string) : 0n,
        data: txParams.data as Hex | undefined,
        gas: txParams.gas ? BigInt(txParams.gas as string) : undefined,
        maxFeePerGas: txParams.maxFeePerGas
          ? BigInt(txParams.maxFeePerGas as string)
          : undefined,
        maxPriorityFeePerGas: txParams.maxPriorityFeePerGas
          ? BigInt(txParams.maxPriorityFeePerGas as string)
          : undefined,
      })
    }

    case 'wallet_switchEthereumChain':
      return Promise.resolve(null)

    case 'wallet_getCapabilities': {
      const [requestedAddress, chainIds] = (params || []) as [
        Address | undefined,
        string[] | undefined,
      ]
      const address = requestedAddress || getAddress()
      if (!address) {
        return Promise.resolve({})
      }
      const requestedChains = chainIds || [numberToHex(mainnet.id)]
      const capabilities: Record<string, Record<string, unknown>> = {}
      for (const chainId of requestedChains) {
        capabilities[chainId] = {
          atomicBatch: {
            supported: false,
          },
        }
      }
      return Promise.resolve(capabilities)
    }

    case 'personal_sign': {
      const [message] = params as [Hex]
      return signMessage(message)
    }

    case 'eth_signTypedData_v4': {
      const [, typedData] = params as [Address, string]
      return signTypedData(typedData)
    }

    default: {
      const client = createPublicClient({
        chain: mainnet,
        transport: http(),
      })

      return client.request({
        method: method as never,
        params: params as never,
      })
    }
  }
}

export function statusConnector(options: StatusConnectorOptions) {
  const { getAddress, signAndSendTransaction, signMessage, signTypedData } =
    options

  return createConnector(config => {
    const createProvider = () => {
      const provider = {
        isStatus: true,
        isMetaMask: true,
        get connected() {
          return !!getAddress()
        },
        chainId: numberToHex(mainnet.id),
        get selectedAddress() {
          return getAddress()
        },
        request: async ({
          method,
          params,
        }: {
          method: string
          params?: unknown[]
        }) => {
          return handleProviderRequest(method, params, {
            getAddress,
            signAndSendTransaction,
            signMessage,
            signTypedData,
            emitter: config.emitter as unknown as {
              emit: (event: string, ...args: unknown[]) => void
            },
          })
        },
        on(event: string, handler: (...args: unknown[]) => void) {
          config.emitter.on(event as never, handler)
        },
        removeListener(event: string, handler: (...args: unknown[]) => void) {
          config.emitter.off(event as never, handler)
        },
      }
      return provider
    }

    const provider = createProvider()

    if (typeof window !== 'undefined') {
      ;(window as { ethereum?: unknown }).ethereum = provider
    }

    return {
      id: 'status-wallet',
      name: 'Status Wallet',
      type: 'injected' as const,

      async connect<withCapabilities extends boolean = false>() {
        const address = getAddress()
        if (!address) {
          throw new Error('No wallet connected')
        }
        return {
          accounts: [address] as readonly Address[],
          chainId: mainnet.id,
        } as {
          accounts: withCapabilities extends true
            ? readonly {
                address: Address
                capabilities: Record<string, unknown>
              }[]
            : readonly Address[]
          chainId: number
        }
      },

      // required by wagmi's connector interface
      // empty because we delegate connection state to wallet-context through getAddress()
      async disconnect() {},

      async getAccounts() {
        const address = getAddress()
        return address ? [address] : []
      },

      async getChainId() {
        return mainnet.id
      },

      async isAuthorized() {
        return !!getAddress()
      },

      async switchChain({ chainId }) {
        const chain = config.chains.find(c => c.id === chainId)
        if (!chain) throw new Error('Chain not found')
        config.emitter.emit('change', { chainId })
        return chain
      },

      onAccountsChanged(accounts) {
        if (accounts.length === 0) {
          config.emitter.emit('disconnect')
        } else {
          config.emitter.emit('change', { accounts: accounts as Address[] })
        }
      },

      onChainChanged(chainId) {
        config.emitter.emit('change', {
          chainId: Number(chainId),
        })
      },

      onDisconnect() {
        config.emitter.emit('disconnect')
      },

      async getProvider() {
        return provider
      },
    }
  })
}
