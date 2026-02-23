import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import {
  type ApprovalResult,
  clearApprovalResult,
  clearPendingApproval,
  getPendingApproval,
  type PendingApproval,
  setPendingApproval,
} from './approval'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

let currentChainId = '0x1'

async function getAddress(): Promise<string | null> {
  const result = await chrome.storage.session.get('dappAddress')
  return (result.dappAddress as string) || null
}

async function getWalletId(): Promise<string | null> {
  const result = await chrome.storage.session.get('dappWalletId')
  return (result.dappWalletId as string) || null
}

async function isOriginConnected(origin: string): Promise<boolean> {
  const result = await chrome.storage.session.get('connectedOrigins')
  const origins: string[] = result.connectedOrigins || []
  return origins.includes(origin)
}

async function addConnectedOrigin(origin: string): Promise<void> {
  const result = await chrome.storage.session.get('connectedOrigins')
  const origins: string[] = result.connectedOrigins || []
  if (!origins.includes(origin)) {
    origins.push(origin)
    await chrome.storage.session.set({ connectedOrigins: origins })
  }
}

async function removeConnectedOrigin(origin: string): Promise<void> {
  const result = await chrome.storage.session.get('connectedOrigins')
  const origins: string[] = result.connectedOrigins || []
  const filtered = origins.filter(o => o !== origin)
  await chrome.storage.session.set({ connectedOrigins: filtered })
}

type PendingApprovalInput = PendingApproval extends infer T
  ? T extends PendingApproval
    ? Omit<T, 'id'>
    : never
  : never

function requestApproval(
  approval: PendingApprovalInput,
): Promise<ApprovalResult | null> {
  return new Promise(resolve => {
    const id = crypto.randomUUID()
    let popupWindowId: number | undefined
    let settled = false
    const timeout: ReturnType<typeof setTimeout> = setTimeout(
      () => {
        cleanup()
        resolve(null)
      },
      5 * 60 * 1000,
    )

    const cleanup = () => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      chrome.storage.onChanged.removeListener(storageListener)
      chrome.windows.onRemoved.removeListener(windowListener)
      clearPendingApproval()
      clearApprovalResult()
    }

    const storageListener = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area !== 'session' || !changes.approvalResult) return
      const result = changes.approvalResult.newValue as
        | ApprovalResult
        | undefined
      if (!result || result.id !== id) return
      cleanup()
      resolve(result.approved ? result : null)
    }

    const windowListener = (removedWindowId: number) => {
      if (removedWindowId !== popupWindowId) return
      cleanup()
      resolve(null)
    }

    chrome.storage.onChanged.addListener(storageListener)
    chrome.windows.onRemoved.addListener(windowListener)

    setPendingApproval({ id, ...approval } as PendingApproval).then(
      async () => {
        const popupUrl = chrome.runtime.getURL('approval.html')
        const currentWindow = await chrome.windows.getCurrent()
        const width = 390
        const height = 628
        const left =
          (currentWindow.left ?? 0) + (currentWindow.width ?? 0) - width - 16
        const top = (currentWindow.top ?? 0) + 16

        const popup = await chrome.windows.create({
          url: popupUrl,
          type: 'popup',
          width,
          height,
          left,
          top,
          focused: true,
        })
        popupWindowId = popup?.id
      },
    )
  })
}

/**
 * Handle an EIP-1193 RPC request from a dApp.
 * Runs in the background service worker context.
 */
export async function handleRpcRequest(
  method: string,
  params: unknown,
  origin: string,
  metadata?: { title?: string; favicon?: string },
): Promise<unknown> {
  switch (method) {
    case 'eth_requestAccounts': {
      const address = await getAddress()
      if (!address) {
        throw { code: 4100, message: 'No active account' }
      }

      if (await isOriginConnected(origin)) {
        return [address]
      }

      const existing = await getPendingApproval()
      if (existing) {
        throw {
          code: -32002,
          message: 'Already processing a connection request.',
        }
      }

      const connectResult = await requestApproval({
        type: 'eth_requestAccounts',
        origin,
        title: metadata?.title ?? origin,
        favicon: metadata?.favicon ?? `${origin}/favicon.ico`,
        address,
        chainId: currentChainId,
      })

      if (!connectResult) {
        throw { code: 4001, message: 'User rejected the request.' }
      }

      await addConnectedOrigin(origin)
      return [address]
    }

    case 'eth_accounts': {
      const address = await getAddress()
      return address ? [address] : []
    }

    case 'eth_chainId': {
      return currentChainId
    }

    case 'net_version': {
      return parseInt(currentChainId, 16).toString()
    }

    case 'wallet_switchEthereumChain': {
      const p = params as [{ chainId: string }] | undefined
      const requestedChainId = p?.[0]?.chainId
      if (requestedChainId) {
        currentChainId = requestedChainId
      }
      return null
    }

    case 'wallet_addEthereumChain': {
      // Accept silently — we don't actually add chains but
      // returning null lets wagmi's switchChain flow continue.
      return null
    }

    case 'wallet_requestPermissions': {
      return [
        {
          parentCapability: 'eth_accounts',
          caveats: [],
        },
      ]
    }

    case 'wallet_revokePermissions': {
      await removeConnectedOrigin(origin)
      return null
    }

    case 'wallet_getCapabilities': {
      const p = (params as unknown[]) || []
      const addr = (p[0] as string) || (await getAddress())
      if (!addr) return {}
      const chainIds = (p[1] as string[]) || ['0x1']
      const capabilities: Record<string, Record<string, unknown>> = {}
      for (const chainId of chainIds) {
        capabilities[chainId] = {
          atomicBatch: { supported: false },
        }
      }
      return capabilities
    }

    case 'personal_sign': {
      const p = params as [string, string]
      const message = p[0]
      const signerAddress = p[1] || (await getAddress())
      if (!signerAddress) {
        throw { code: 4100, message: 'No active account' }
      }

      const walletId = await getWalletId()
      if (!walletId) {
        throw { code: 4100, message: 'No wallet available' }
      }

      // Guard against concurrent approval requests
      const existingSign = await getPendingApproval()
      if (existingSign) {
        throw { code: -32002, message: 'Already processing a request.' }
      }

      const signResult = await requestApproval({
        type: 'personal_sign',
        origin,
        title: metadata?.title ?? origin,
        favicon: metadata?.favicon ?? `${origin}/favicon.ico`,
        address: signerAddress,
        chainId: currentChainId,
        message,
      })

      if (!signResult?.password) {
        throw { code: 4001, message: 'User rejected the request.' }
      }

      const signed = await (
        globalThis as unknown as {
          api: {
            wallet: {
              account: {
                ethereum: {
                  signMessage: (input: {
                    walletId: string
                    password: string
                    fromAddress: string
                    message: string
                  }) => Promise<{ signature: string }>
                }
              }
            }
          }
        }
      ).api.wallet.account.ethereum.signMessage({
        walletId,
        password: signResult.password,
        fromAddress: signerAddress,
        message,
      })

      return signed.signature
    }

    case 'eth_signTypedData_v4':
    case 'eth_sendTransaction': {
      throw {
        code: 4200,
        message: 'Not yet supported via dApp connection',
      }
    }

    default: {
      return await publicClient.request({
        method: method as never,
        params: params as never,
      })
    }
  }
}
