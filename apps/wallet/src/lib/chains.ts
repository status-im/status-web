import { numberToHex } from 'viem'
import { mainnet, statusNetworkSepolia } from 'viem/chains'

import ethereumIcon from '../assets/networks/ethereum.png'
import statusNetworkIcon from '../assets/networks/status-network.png'

import type { Chain } from 'viem'

export type ChainEntry = {
  chainId: number
  /** Canonical EIP-695 form, which is what dApps and `chrome.storage` see. */
  hex: string
  name: string
  icon: string
  viemChain: Chain
  /**
   * What `rpc.proxy` is asked for, or null when the wallet's proxy has no
   * upstream route for the chain. `CHAIN_ID_TO_PROXY_PATH` in
   * `packages/wallet/src/data/api/routers/rpc.ts` is the other half of this --
   * a chain is only readable once both are filled in.
   */
  proxyChainId: number | null
  /**
   * Sends are fenced at the backend, not here: `nodes.getFeeRate`,
   * `broadcastTransaction` and `getNonce` all pin `z.enum(['ethereum'])`.
   */
  canSign: boolean
}

type ChainDefinition = Omit<ChainEntry, 'chainId' | 'hex' | 'viemChain'>

function defineEntry(chain: Chain, definition: ChainDefinition): ChainEntry {
  return {
    chainId: chain.id,
    hex: numberToHex(chain.id),
    viemChain: chain,
    ...definition,
  }
}

/**
 * Every chain the wallet advertises to dApps, and everything the extension
 * needs to know about each. Replaces the three disagreeing lists this used to
 * be spread across: the switchable set in `rpc/chain.ts`, the mainnet pin in
 * `public-client.ts`, and the name/icon maps in the approval popup.
 */
export const CHAINS: ChainEntry[] = [
  defineEntry(mainnet, {
    name: 'Mainnet',
    icon: ethereumIcon,
    proxyChainId: mainnet.id,
    canSign: true,
  }),
  defineEntry(statusNetworkSepolia, {
    name: 'Status Network Sepolia',
    icon: statusNetworkIcon,
    // No upstream proxy path is known for 1660990954 -- the backend's `374:
    // 'status/hoodi'` is a different network. The chain stays advertised and
    // switchable; reads on it fail loudly until this and the matching entry in
    // `routers/rpc.ts` land together.
    proxyChainId: null,
    canSign: false,
  }),
]

const BY_CHAIN_ID = new Map(CHAINS.map(chain => [chain.chainId, chain]))

export function getChain(chainId: number): ChainEntry | undefined {
  return BY_CHAIN_ID.get(chainId)
}

/**
 * The one place the hex chain ids dApps speak become numbers. Malformed input
 * is NaN rather than a prefix -- `parseInt` would read `'0x1zzz'` and a bare
 * `'1'` as mainnet, and these params come from the page.
 */
export function toChainId(hex: string): number {
  return /^0x[0-9a-fA-F]+$/.test(hex) ? Number.parseInt(hex, 16) : NaN
}

/**
 * Looked up by value rather than by string, so `'0x6300B5EA'` and
 * `'0x06300b5ea'` resolve like the canonical spelling instead of reading as
 * unknown chains.
 */
export function getChainByHex(hex: string): ChainEntry | undefined {
  return getChain(toChainId(hex))
}
