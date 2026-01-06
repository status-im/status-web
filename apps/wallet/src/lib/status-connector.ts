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

export function statusConnector(options: StatusConnectorOptions) {
  const { getAddress, signAndSendTransaction, signMessage, signTypedData } =
    options

  // @ts-expect-error - TypeScript can't infer the conditional return type withCapabilities
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
          const address = getAddress()
          switch (method) {
            case 'eth_requestAccounts':
            case 'eth_accounts': {
              const accounts = address ? [address] : []
              if (method === 'eth_requestAccounts' && accounts.length > 0) {
                config.emitter.emit('connect', {
                  accounts,
                  chainId: mainnet.id,
                })
              }
              return accounts
            }

            case 'eth_chainId':
              return numberToHex(mainnet.id)

            case 'eth_sendTransaction': {
              const txParams = (params as Record<string, unknown>[])?.[0]
              if (!txParams) throw new Error('No transaction params')

              const hash = await signAndSendTransaction({
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

              return hash
            }

            case 'wallet_switchEthereumChain':
              return null

            case 'wallet_getCapabilities': {
              const [requestedAddress, chainIds] = (params || []) as [
                Address | undefined,
                string[] | undefined,
              ]
              const address = requestedAddress || getAddress()
              if (!address) {
                return {}
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
              return capabilities
            }

            case 'personal_sign': {
              const [message] = params as [Hex]
              const signature = await signMessage(message)
              return signature
            }

            case 'eth_signTypedData_v4': {
              const [, typedData] = params as [Address, string]
              const signature = await signTypedData(typedData)
              return signature
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

      async connect() {
        const address = getAddress()
        if (!address) {
          throw new Error('No wallet connected')
        }
        return {
          accounts: [address] as readonly Address[],
          chainId: mainnet.id,
        }
      },

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
