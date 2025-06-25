import { useEffect, useRef } from 'react'

import { useAccount, useConnect } from 'wagmi'

import { useWallet } from './wallet-context'

export function StatusAutoConnect() {
  const { currentWallet } = useWallet()
  const { connect, connectors } = useConnect()
  const { isConnected, chainId } = useAccount()
  const providerSetupRef = useRef(false)

  useEffect(() => {
    if (providerSetupRef.current) return
    providerSetupRef.current = true

    const eventListeners: {
      [event: string]: ((...args: unknown[]) => void)[]
    } = {}

    const createEthereumProvider = (walletAddress?: string) => {
      const hasWallet = !!walletAddress

      const ethereumProvider = {
        isMetaMask: false,
        isStatus: true,
        selectedAddress: walletAddress || null,
        chainId: chainId,
        networkVersion: '10',
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
          switch (args.method) {
            case 'eth_accounts':
            case 'eth_requestAccounts': {
              const accounts = walletAddress ? [walletAddress] : []
              return accounts
            }
            case 'eth_chainId':
              return chainId
            case 'net_version':
              return chainId
            case 'wallet_switchEthereumChain':
            case 'wallet_addEthereumChain':
              return null
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
        },

        on: (event: string, listener: (...args: unknown[]) => void) => {
          if (!eventListeners[event]) {
            eventListeners[event] = []
          }
          eventListeners[event].push(listener)
        },

        removeListener: (
          event: string,
          listener: (...args: unknown[]) => void,
        ) => {
          if (eventListeners[event]) {
            const index = eventListeners[event].indexOf(listener)
            if (index > -1) {
              eventListeners[event].splice(index, 1)
            }
          }
        },

        addListener: (
          event: string,
          listener: (...args: unknown[]) => void,
        ) => {
          return ethereumProvider.on(event, listener)
        },

        off: (event: string, listener: (...args: unknown[]) => void) => {
          return ethereumProvider.removeListener(event, listener)
        },

        emit: (event: string, ...args: unknown[]) => {
          if (eventListeners[event]) {
            eventListeners[event].forEach(listener => listener(...args))
          }
        },
      }

      return ethereumProvider
    }

    // Set up initial provider without wallet
    const initialProvider = createEthereumProvider()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).ethereum = initialProvider

    const announceProvider = (provider: typeof initialProvider) => {
      window.dispatchEvent(new Event('ethereum#initialized'))
      window.dispatchEvent(
        new CustomEvent('eip6963:announceProvider', {
          detail: {
            info: {
              uuid: 'c14d6a7e-14c2-477d-bcb7-ffb732145eae',
              name: 'Status',
              rdns: 'app.status',
              icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzk1MF8xMjM5NikiPiA8bWFzayBpZD0ibWFzazBfOTUwXzEyMzk2IiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSItMSIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMzIj4gPHBhdGggZD0iTTE2IC0wLjAwMDQ4ODI4MUM0IC0wLjAwMDQ4ODI4MSAwIDMuOTk5NTEgMCAxNS45OTk1QzAgMjcuOTk5NSA0IDMxLjk5OTUgMTYgMzEuOTk5NUMyOCAzMS45OTk1IDMyIDI3Ljk5OTUgMzIgMTUuOTk5NUMzMiAzLjk5OTUxIDI4IC0wLjAwMDQ4ODI4MSAxNiAtMC4wMDA0ODgyODFaIiBmaWxsPSJ3aGl0ZSIvPiA8L21hc2s+IDxnIG1hc2s9InVybCgjbWFzazBfOTUwXzEyMzk2KSI+IDxnIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2ZfOTUwXzEyMzk2KSI+IDxjaXJjbGUgY3g9IjIzIiBjeT0iOC45OTk1MSIgcj0iMTkiIGZpbGw9IiMxOTkyRDciLz4gPC9nPiA8ZyBmaWx0ZXI9InVybCgjZmlsdGVyMV9mXzk1MF8xMjM5NikiPiA8Y2lyY2xlIGN4PSIzMyIgY3k9IjE4Ljk5OTUiIHI9IjE5IiBmaWxsPSIjRjZCMDNDIi8+IDwvZz4gPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjJfZl85NTBfMTIzOTYpIj4gPGNpcmNsZSBjeD0iNSIgY3k9IjMwLjk5OTUiIHI9IjE5IiBmaWxsPSIjRkY3RDQ2Ii8+IDwvZz4gPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjNfZl85NTBfMTIzOTYpIj4gPGNpcmNsZSBjeD0iLTciIGN5PSI4Ljk5OTUxIiByPSIxOSIgZmlsbD0iIzcxNDBGRCIvPiA8L2c+IDxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTguMTI4NCA4LjgwODQzQzE0Ljk1NTEgOC45ODk4NCAxMi42MTIxIDExLjg3NDMgMTIuMzUxNiAxNS4xMzc1QzEyLjM2NzYgMTUuMTMyNiAxMi4zODUzIDE1LjEyNzYgMTIuNDAzIDE1LjEyMjdDMTIuNDIwNyAxNS4xMTc4IDEyLjQzODQgMTUuMTEyOSAxMi40NTQ0IDE1LjEwOEMxMi44NTM1IDE1LjAwNjcgMTMuMjYxNyAxNC45NDUyIDEzLjY3MzEgMTQuOTI0M0MxNC41NjQxIDE0Ljg3NDUgMTUuMjg4NyAxNC45NTE2IDE2LjAxMzIgMTUuMDI4OEMxNi43Mzg3IDE1LjEwNiAxNy40NjQgMTUuMTgzMiAxOC4zNTYyIDE1LjEzMjlDMTguNzY1OCAxNS4xMTEzIDE5LjE3MjIgMTUuMDQ3OSAxOS41Njg4IDE0Ljk0NEMyMS4yNDc2IDE0LjUwODYgMjIuMjEzNSAxMy4zNzQgMjIuMTI4MiAxMS44MTkxQzIyLjAyMzEgOS44ODcwOCAyMC4wNzY5IDguNjk3MzIgMTguMTI4NCA4LjgwODQzWk0xMy44Nzk2IDIzLjE5MDlDMTcuMDUyOSAyMy4wMDk1IDE5LjM5NTkgMjAuMTI1IDE5LjY1NjQgMTYuODYxOEMxOS42MzYzIDE2Ljg2OCAxOS42MTM1IDE2Ljg3NDIgMTkuNTkxNSAxNi44ODAxQzE5LjU3ODQgMTYuODgzNyAxOS41NjU1IDE2Ljg4NzIgMTkuNTUzNiAxNi44OTA1QzE5LjE1NDUgMTYuOTkxOSAxOC43NDYyIDE3LjA1MzQgMTguMzM0OCAxNy4wNzQyQzE3LjQ0MjcgMTcuMTI0OSAxNi43MTczIDE3LjA0NzkgMTUuOTkxOSAxNi45NzA4QzE1LjI2NzQgMTYuODkzOCAxNC41NDI4IDE2LjgxNjkgMTMuNjUxOCAxNi44NjcxQzEzLjI0MjEgMTYuODg4OCAxMi44MzU4IDE2Ljk1MjEgMTIuNDM5MiAxNy4wNTYxQzEwLjc2MDMgMTcuNDkwNyA5Ljc5ODI5IDE4LjYyNTMgOS44Nzk3OSAyMC4xODAyQzkuOTg0OTEgMjIuMTEyMiAxMS45MzExIDIzLjMwMiAxMy44Nzk2IDIzLjE5MDlaIiBmaWxsPSJ3aGl0ZSIvPiA8L2c+IDwvZz4gPGRlZnM+IDxmaWx0ZXIgaWQ9ImZpbHRlcjBfZl85NTBfMTIzOTYiIHg9Ii01LjQzMDI2IiB5PSItMTkuNDMwNyIgd2lkdGg9IjU2Ljg2MDUiIGhlaWdodD0iNTYuODYwNSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPiA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPiA8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPiA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0LjcxNTEzIiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfOTUwXzEyMzk2Ii8+IDwvZmlsdGVyPiA8ZmlsdGVyIGlkPSJmaWx0ZXIxX2ZfOTUwXzEyMzk2IiB4PSI0LjU2OTc0IiB5PSItOS40MzA3NSIgd2lkdGg9IjU2Ljg2MDUiIGhlaWdodD0iNTYuODYwNSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPiA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPiA8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPiA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0LjcxNTEzIiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfOTUwXzEyMzk2Ii8+IDwvZmlsdGVyPiA8ZmlsdGVyIGlkPSJmaWx0ZXIyX2ZfOTUwXzEyMzk2IiB4PSItMjMuNDMwMyIgeT0iMi41NjkyNSIgd2lkdGg9IjU2Ljg2MDUiIGhlaWdodD0iNTYuODYwNSIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPiA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPiA8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPiA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI0LjcxNTEzIiByZXN1bHQ9ImVmZmVjdDFfZm9yZWdyb3VuZEJsdXJfOTUwXzEyMzk2Ii8+IDwvZmlsdGVyPiA8ZmlsdGVyIGlkPSJmaWx0ZXIzX2ZfOTUwXzEyMzk2IiB4PSItMzUuNDMwMyIgeT0iLTE5LjQzMDciIHdpZHRoPSI1Ni44NjA1IiBoZWlnaHQ9IjU2Ljg2MDUiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4gPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4gPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4gPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNC43MTUxMyIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzk1MF8xMjM5NiIvPiA8L2ZpbHRlcj4gPGNsaXBQYXRoIGlkPSJjbGlwMF85NTBfMTIzOTYiPiA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9IndoaXRlIi8+IDwvY2xpcFBhdGg+IDwvZGVmcz4gPC9zdmc+',
            },
            provider: provider as unknown,
          },
        }),
      )
    }

    announceProvider(initialProvider)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).__statusWallet = {
      createEthereumProvider,
      announceProvider,
    }
  }, [])

  useEffect(() => {
    const address = currentWallet?.activeAccounts[0]?.address

    if (address) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const statusWallet = (window as any).__statusWallet
      if (statusWallet) {
        const updatedProvider = statusWallet.createEthereumProvider(address)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).ethereum = updatedProvider

        const emitEvents = () => {
          updatedProvider.emit('connect', { chainId })
          updatedProvider.emit('accountsChanged', [address])
          updatedProvider.emit('chainChanged', chainId)
        }

        emitEvents()
        setTimeout(emitEvents, 100)
        setTimeout(emitEvents, 500)

        statusWallet.announceProvider(updatedProvider)
      }

      if (!isConnected) {
        const injectedConnector = connectors.find(c => c.id === 'injected')
        if (injectedConnector) {
          connect({ connector: injectedConnector })
        }
      }
    }
  }, [currentWallet?.activeAccounts, isConnected, connectors, connect, chainId])

  return null
}
