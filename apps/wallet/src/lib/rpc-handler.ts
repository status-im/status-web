import { ProviderRpcError } from '@status-im/ethereum-provider'
import { storage } from '@wxt-dev/storage'

import {
  APPROVAL_TIMEOUT_MS,
  type ApprovalResult,
  clearApprovalResult,
  clearPendingApproval,
  getApprovalResult,
  getPendingApproval,
  type PendingApproval,
  setPendingApproval,
} from '../data/approval'
import {
  adoptSelectedAddress,
  connectAccount,
  debugLog,
  getChainIdForOrigin,
  getSelectedAddress,
  isOriginPermitted,
  isSameAddress,
  revokeOrigin,
  setChainIdForOrigin,
} from '../data/dapp-permissions'
import * as walletMetadata from '../data/wallet-metadata'
import { publicClient } from './public-client'
import { SELECTED_WALLET_ID_KEY } from './storage-keys'

const SUPPORTED_CHAIN_IDS = new Set(['0x1', '0x6300b5ea'])
const DEFAULT_ACCOUNT_NAME = 'Account 1'

const APPROVAL_POPUP_WIDTH = 390
const APPROVAL_POPUP_HEIGHT = 628

type ActiveAccount = {
  address: string
  accountName: string
  walletId: string
}

/**
 * The account exposed to dApps.
 *
 * The extension page mirrors its selection into session storage, but that is
 * empty after a browser restart until the page is opened. Permissions live in
 * `local` and outlast it, so fall back to wallet metadata -- otherwise a still
 * permitted dApp would be told there is no account. Mirrors the selection rule
 * in `wallet-context.tsx`.
 */
async function getActiveAccount(): Promise<ActiveAccount | null> {
  const session = await chrome.storage.session.get([
    'dappAddress',
    'dappAccountName',
    'dappWalletId',
  ])

  if (session.dappAddress && session.dappWalletId) {
    return {
      address: session.dappAddress as string,
      accountName: (session.dappAccountName as string) || DEFAULT_ACCOUNT_NAME,
      walletId: session.dappWalletId as string,
    }
  }

  const wallets = await walletMetadata.getAll()
  const selectedId = await storage.getItem<string>(SELECTED_WALLET_ID_KEY)
  const wallet = wallets.find(w => w.id === selectedId) ?? wallets[0]
  if (!wallet) return null

  const account =
    wallet.accounts.find(a => a.address === wallet.selectedAccountAddress) ??
    wallet.accounts[0]
  if (!account) return null

  return {
    address: account.address,
    accountName: wallet.name || DEFAULT_ACCOUNT_NAME,
    walletId: wallet.id,
  }
}

async function getAddress(): Promise<string | null> {
  return (await getActiveAccount())?.address ?? null
}

async function getAccountName(): Promise<string> {
  return (await getActiveAccount())?.accountName ?? DEFAULT_ACCOUNT_NAME
}

/**
 * The account this origin sees, which is not necessarily the wallet's current
 * selection: switching to an account the user never connected here must leave
 * the dApp on the one it was connected with.
 *
 * Every dApp-facing read and signature resolves through this -- reading the
 * pinned account for `eth_accounts` while signing with the selected one would
 * hand the dApp a signature from an account it was never shown.
 */
async function getOriginAddress(origin: string): Promise<string | null> {
  if (!(await isOriginPermitted(origin))) {
    return null
  }

  const selected = await getSelectedAddress(origin)
  if (selected) {
    return selected
  }

  // Connected before per-account tracking existed: the account it has been
  // showing is the active one, so pin it there once.
  const active = await getAddress()
  return active ? await adoptSelectedAddress(origin, active) : null
}

/**
 * Locates the wallet holding `address`, across all wallets -- the account a dApp
 * is pinned to may not belong to the currently selected wallet.
 */
async function findWalletForAddress(
  address: string,
): Promise<{ walletId: string; accountName: string } | null> {
  const wallets = await walletMetadata.getAll()
  const wallet = wallets.find(w =>
    w.accounts.some(account => isSameAddress(account.address, address)),
  )
  if (!wallet) return null

  return {
    walletId: wallet.id,
    accountName: wallet.name || DEFAULT_ACCOUNT_NAME,
  }
}

type PendingApprovalInput = PendingApproval extends infer T
  ? T extends PendingApproval
    ? Omit<T, 'id' | 'createdAt'>
    : never
  : never

/**
 * Synchronous claim on the single approval slot.
 *
 * The stored `pendingApproval` is read asynchronously, so two requests
 * arriving in the same tick both saw it empty and each opened a popup, then
 * clobbered each other's record -- one of the windows ends up showing a
 * request that no longer exists. The service worker is single-threaded, so a
 * plain variable closes that window; the stored record still guards across
 * worker restarts.
 */
let approvalInFlight = false

function requestApproval(
  approval: PendingApprovalInput,
): Promise<ApprovalResult | null> {
  if (approvalInFlight) {
    return Promise.reject(
      new ProviderRpcError({
        code: -32002,
        message: 'Already processing a request.',
      }),
    )
  }
  approvalInFlight = true

  return new Promise(resolve => {
    const id = crypto.randomUUID()
    let popupWindowId: number | undefined
    let settled = false
    const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
      cleanup()
      resolve(null)
    }, APPROVAL_TIMEOUT_MS)

    const cleanup = () => {
      if (settled) return
      settled = true
      approvalInFlight = false
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
      // The approval page writes its result and then closes itself, so this
      // can arrive before the storage change that carries the verdict.
      // Treating the close as a rejection outright loses approvals: re-read
      // the result and only fall back to rejection when there genuinely is
      // none.
      void getApprovalResult().then(result => {
        cleanup()
        resolve(result?.id === id && result.approved ? result : null)
      })
    }

    chrome.storage.onChanged.addListener(storageListener)
    chrome.windows.onRemoved.addListener(windowListener)
    ;(async () => {
      try {
        await setPendingApproval({
          id,
          createdAt: Date.now(),
          ...approval,
        } as PendingApproval)
        const popupUrl = chrome.runtime.getURL('approval.html')
        const currentWindow = await chrome.windows.getCurrent()
        const left =
          (currentWindow.left ?? 0) +
          (currentWindow.width ?? 0) -
          APPROVAL_POPUP_WIDTH -
          16
        const top = (currentWindow.top ?? 0) + 16

        const popup = await chrome.windows.create({
          url: popupUrl,
          type: 'popup',
          width: APPROVAL_POPUP_WIDTH,
          height: APPROVAL_POPUP_HEIGHT,
          left,
          top,
          focused: true,
        })
        popupWindowId = popup?.id
      } catch {
        cleanup()
        resolve(null)
      }
    })()
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
  if (
    method === 'eth_accounts' ||
    method === 'eth_requestAccounts' ||
    method === 'wallet_requestPermissions'
  ) {
    void debugLog(method, {
      origin,
      permitted: await isOriginPermitted(origin),
      address: await getAddress(),
    })
  }

  switch (method) {
    case 'eth_requestAccounts': {
      // Answer from the origin's own account when it has one, or a dApp that
      // calls this on every mount would flip back to the wallet's selection
      // and contradict eth_accounts.
      const connected = await getOriginAddress(origin)
      if (connected) {
        return [connected]
      }

      const address = await getAddress()
      if (!address) {
        throw new ProviderRpcError({
          code: 4100,
          message: 'No active account',
        })
      }

      const existing = await getPendingApproval()
      if (existing) {
        throw new ProviderRpcError({
          code: -32002,
          message: 'Already processing a connection request.',
        })
      }

      const chainId = await getChainIdForOrigin(origin)
      const accountName = await getAccountName()
      const connectResult = await requestApproval({
        type: 'eth_requestAccounts',
        origin,
        title: metadata?.title ?? origin,
        favicon: metadata?.favicon ?? `${origin}/favicon.ico`,
        address,
        accountName,
        chainId,
      })

      if (!connectResult) {
        throw new ProviderRpcError({
          code: 4001,
          message: 'User rejected the request.',
        })
      }

      await connectAccount(origin, address)
      void debugLog('granted', { origin, address })
      return [address]
    }

    case 'eth_accounts': {
      const address = await getOriginAddress(origin)
      return address ? [address] : []
    }

    case 'eth_chainId': {
      return await getChainIdForOrigin(origin)
    }

    case 'net_version': {
      const chainId = await getChainIdForOrigin(origin)
      return parseInt(chainId, 16).toString()
    }

    case 'wallet_switchEthereumChain': {
      const p = params as [{ chainId: string }] | undefined
      const requestedChainId = p?.[0]?.chainId
      if (requestedChainId && !SUPPORTED_CHAIN_IDS.has(requestedChainId)) {
        throw new ProviderRpcError({
          code: 4902,
          message: `Unrecognized chain ID ${requestedChainId}. Try adding the chain using wallet_addEthereumChain first.`,
        })
      }
      if (requestedChainId) {
        await setChainIdForOrigin(origin, requestedChainId)
      }
      return null
    }

    case 'wallet_addEthereumChain': {
      const p = params as [{ chainId: string }] | undefined
      const requestedChainId = p?.[0]?.chainId
      if (requestedChainId && !SUPPORTED_CHAIN_IDS.has(requestedChainId)) {
        throw new ProviderRpcError({
          code: 4902,
          message: `Chain ${requestedChainId} is not supported`,
        })
      }
      if (requestedChainId) {
        await setChainIdForOrigin(origin, requestedChainId)
      }
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
      await revokeOrigin(origin)
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
      // The origin's own account, not the wallet's selection: signing with the
      // selected account would return a signature from a key the dApp was
      // never shown.
      const signerAddress = await getOriginAddress(origin)
      if (!signerAddress) {
        throw new ProviderRpcError({
          code: 4100,
          message: 'No connected account',
        })
      }
      if (p[1] && !isSameAddress(signerAddress, p[1])) {
        throw new ProviderRpcError({
          code: -32602,
          message: `Requested address ${p[1]} does not match the connected account`,
        })
      }

      const signer = await findWalletForAddress(signerAddress)
      if (!signer) {
        throw new ProviderRpcError({
          code: 4100,
          message: 'No wallet available',
        })
      }

      // Guard against concurrent approval requests
      const existingSign = await getPendingApproval()
      if (existingSign) {
        throw new ProviderRpcError({
          code: -32002,
          message: 'Already processing a request.',
        })
      }

      const signChainId = await getChainIdForOrigin(origin)
      const signResult = await requestApproval({
        type: 'personal_sign',
        origin,
        title: metadata?.title ?? origin,
        favicon: metadata?.favicon ?? `${origin}/favicon.ico`,
        address: signerAddress,
        accountName: signer.accountName,
        chainId: signChainId,
        message,
      })

      if (!signResult) {
        throw new ProviderRpcError({
          code: 4001,
          message: 'User rejected the request.',
        })
      }

      const signed = await (
        globalThis as unknown as {
          api: {
            wallet: {
              account: {
                ethereum: {
                  signMessage: (input: {
                    walletId: string
                    fromAddress: string
                    message: string
                  }) => Promise<{ signature: string }>
                }
              }
            }
          }
        }
      ).api.wallet.account.ethereum.signMessage({
        walletId: signer.walletId,
        fromAddress: signerAddress,
        message,
      })

      return signed.signature
    }

    case 'eth_signTypedData_v4':
    case 'eth_sendTransaction': {
      throw new ProviderRpcError({
        code: 4200,
        message: 'Not yet supported via dApp connection',
      })
    }

    default: {
      return await publicClient.request({
        method: method as never,
        params: params as never,
      })
    }
  }
}
