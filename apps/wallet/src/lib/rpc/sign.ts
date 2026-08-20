import { ProviderRpcError } from '@status-im/ethereum-provider'

import { getPendingApproval } from '../../data/approval'
import { getChainIdForOrigin, isSameAddress } from '../../data/dapp-permissions'
import { findWalletForAddress, getOriginAddress } from './account'
import { noConnectedAccount } from './errors'
import { requestApproval } from './request-approval'
import {
  assertDomainChainId,
  parseTypedData,
  serializeTypedData,
} from './typed-data'

import type { RpcContext } from './context'

type SigningApi = {
  wallet: {
    account: {
      ethereum: {
        signMessage: (input: {
          walletId: string
          fromAddress: string
          message: string
        }) => Promise<{ signature: string }>
        signTypedData: (input: {
          walletId: string
          fromAddress: string
          domain: Record<string, unknown>
          types: Record<string, Array<{ name: string; type: string }>>
          primaryType: string
          message: Record<string, unknown>
        }) => Promise<{ signature: string }>
      }
    }
  }
}

function signingApi(): SigningApi {
  return (globalThis as unknown as { api: SigningApi }).api
}

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/

/**
 * The account the origin is pinned to. Signing with the wallet's selection
 * instead would return a signature from a key the dApp was never shown.
 */
async function requireOriginAddress(origin: string): Promise<string> {
  const address = await getOriginAddress(origin)
  if (!address) {
    // The dispatch gate already refused unpermitted origins, so reaching this
    // means the origin is permitted but its pinned account no longer resolves.
    throw noConnectedAccount()
  }
  return address
}

/** The pinned account may belong to a wallet other than the selected one. */
async function requireWalletFor(
  address: string,
): Promise<{ walletId: string; accountName: string }> {
  const wallet = await findWalletForAddress(address)
  if (!wallet) {
    throw new ProviderRpcError({
      code: 4100,
      message: 'No wallet available',
    })
  }
  return wallet
}

/** The approval slot holds one request; a second must not replace it. */
async function assertNoPendingApproval(): Promise<void> {
  if (await getPendingApproval()) {
    throw new ProviderRpcError({
      code: -32002,
      message: 'Already processing a request.',
    })
  }
}

export async function personal_sign({
  params,
  origin,
  metadata,
}: RpcContext): Promise<string> {
  const p = params as [string, string]
  const message = p[0]
  const signerAddress = await requireOriginAddress(origin)
  if (p[1] && !isSameAddress(signerAddress, p[1])) {
    throw new ProviderRpcError({
      code: -32602,
      message: `Requested address ${p[1]} does not match the connected account`,
    })
  }

  const signer = await requireWalletFor(signerAddress)
  await assertNoPendingApproval()

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

  const signed = await signingApi().wallet.account.ethereum.signMessage({
    walletId: signer.walletId,
    fromAddress: signerAddress,
    message,
  })

  return signed.signature
}

/**
 * EIP-712. The parameters are swapped relative to `personal_sign` -- address
 * first, payload second, per status-go `commands/sign.go`. Nothing here sniffs
 * which argument looks like an address: a dApp sending them the other way
 * round is told so rather than quietly served.
 */
export async function eth_signTypedData_v4({
  params,
  origin,
  metadata,
}: RpcContext): Promise<string> {
  const p = Array.isArray(params) ? params : []
  const requestedAddress = p[0]
  if (
    typeof requestedAddress !== 'string' ||
    !ADDRESS_PATTERN.test(requestedAddress)
  ) {
    throw new ProviderRpcError({
      code: -32602,
      message:
        'eth_signTypedData_v4 expects the address as the first parameter and the typed data as the second',
    })
  }

  const signerAddress = await requireOriginAddress(origin)
  if (!isSameAddress(signerAddress, requestedAddress)) {
    throw new ProviderRpcError({
      code: -32602,
      message: `Requested address ${requestedAddress} does not match the connected account`,
    })
  }

  const chainId = await getChainIdForOrigin(origin)
  // Parsed once. The approval record carries the serialised form because it
  // crosses chrome.storage; the signing call takes the structured one.
  const typedData = parseTypedData(p[1])
  assertDomainChainId(typedData, chainId)
  const serialized = serializeTypedData(typedData)

  const signer = await requireWalletFor(signerAddress)
  await assertNoPendingApproval()

  const result = await requestApproval({
    type: 'eth_signTypedData_v4',
    origin,
    title: metadata?.title ?? origin,
    favicon: metadata?.favicon ?? `${origin}/favicon.ico`,
    address: signerAddress,
    accountName: signer.accountName,
    chainId,
    typedData: serialized,
  })

  if (!result) {
    throw new ProviderRpcError({
      code: 4001,
      message: 'User rejected the request.',
    })
  }

  const signed = await signingApi().wallet.account.ethereum.signTypedData({
    walletId: signer.walletId,
    fromAddress: signerAddress,
    domain: typedData.domain,
    types: typedData.types,
    primaryType: typedData.primaryType,
    message: typedData.message,
  })

  return signed.signature
}
