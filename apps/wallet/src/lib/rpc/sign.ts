import { ProviderRpcError } from '@status-im/ethereum-provider'

import { getPendingApproval } from '../../data/approval'
import { getChainIdForOrigin, isSameAddress } from '../../data/dapp-permissions'
import { findWalletForAddress, getOriginAddress } from './account'
import { noConnectedAccount } from './errors'
import { requestApproval } from './request-approval'

import type { RpcContext } from './context'

type SignMessageApi = {
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

export async function personal_sign({
  params,
  origin,
  metadata,
}: RpcContext): Promise<string> {
  const p = params as [string, string]
  const message = p[0]
  // The origin's own account, not the wallet's selection: signing with the
  // selected account would return a signature from a key the dApp was
  // never shown.
  const signerAddress = await getOriginAddress(origin)
  if (!signerAddress) {
    // The dispatch gate already refused unpermitted origins, so reaching this
    // means the origin is permitted but its pinned account no longer resolves.
    throw noConnectedAccount()
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
    globalThis as unknown as { api: SignMessageApi }
  ).api.wallet.account.ethereum.signMessage({
    walletId: signer.walletId,
    fromAddress: signerAddress,
    message,
  })

  return signed.signature
}

export async function eth_signTypedData_v4(): Promise<never> {
  throw new ProviderRpcError({
    code: 4200,
    message: 'Not yet supported via dApp connection',
  })
}
