import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
})

let currentChainId = '0x1'

async function getAddress(): Promise<string | null> {
  const result = await chrome.storage.session.get('dappAddress')
  return (result.dappAddress as string) || null
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

/**
 * Handle an EIP-1193 RPC request from a dApp.
 * Runs in the background service worker context.
 */
export async function handleRpcRequest(
  method: string,
  params: unknown,
  origin: string,
): Promise<unknown> {
  switch (method) {
    case 'eth_requestAccounts': {
      const address = await getAddress()
      if (!address) {
        throw { code: 4100, message: 'No active account' }
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

    case 'personal_sign':
    case 'eth_signTypedData_v4':
    case 'eth_sendTransaction': {
      throw {
        code: 4200,
        message: 'Signing not yet supported via dApp connection',
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
