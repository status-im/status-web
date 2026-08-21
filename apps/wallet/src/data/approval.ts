/** How long a pending approval stays valid. Mirrored in `rpc-handler.ts`. */
export const APPROVAL_TIMEOUT_MS = 5 * 60 * 1000

export type PendingApproval = { createdAt: number } & (
  | {
      id: string
      type: 'eth_requestAccounts'
      origin: string
      title: string
      favicon: string
      address: string
      accountName: string
      chainId: string
    }
  | {
      id: string
      type: 'personal_sign'
      origin: string
      title: string
      favicon: string
      address: string
      accountName: string
      chainId: string
      message: string
    }
  | {
      id: string
      type: 'eth_signTypedData_v4'
      origin: string
      title: string
      favicon: string
      address: string
      accountName: string
      chainId: string
      /**
       * The EIP-712 payload, serialised. It crosses `chrome.storage`, which
       * round-trips JSON, so the handler parses and validates once and the
       * popup only ever renders this string back.
       */
      typedData: string
    }
  | {
      id: string
      type: 'eth_sendTransaction'
      origin: string
      title: string
      favicon: string
      address: string
      accountName: string
      chainId: string
      to: string
      /** Wei, hex. A bigint would not survive the `chrome.storage` JSON round trip. */
      value: string
      /** Calldata, or null for a plain transfer. */
      data: string | null
      /**
       * The ETH ceiling of `maxFeePerGas * gasLimit`, resolved before the popup
       * opens. The handler sends with the same numbers, so what the user
       * approves is what gets broadcast.
       */
      maxFeeEth: string
    }
)

export type ApprovalResult = {
  id: string
  approved: boolean
}

export async function setPendingApproval(
  approval: PendingApproval,
): Promise<void> {
  await chrome.storage.session.set({ pendingApproval: approval })
}

export async function getPendingApproval(): Promise<PendingApproval | null> {
  const result = await chrome.storage.session.get('pendingApproval')
  const pending = (result.pendingApproval as PendingApproval) || null
  if (!pending) return null

  // MV3 can terminate the worker while the popup is open, killing the handler
  // that would have cleared this. Without an age check the leftover record
  // rejects every later connection attempt with -32002 until the browser
  // restarts.
  if (Date.now() - (pending.createdAt ?? 0) > APPROVAL_TIMEOUT_MS) {
    await clearPendingApproval()
    return null
  }

  return pending
}

export async function clearPendingApproval(): Promise<void> {
  await chrome.storage.session.remove('pendingApproval')
}

export async function setApprovalResult(result: ApprovalResult): Promise<void> {
  await chrome.storage.session.set({ approvalResult: result })
}

export async function getApprovalResult(): Promise<ApprovalResult | null> {
  const result = await chrome.storage.session.get('approvalResult')
  return (result.approvalResult as ApprovalResult) || null
}

export async function clearApprovalResult(): Promise<void> {
  await chrome.storage.session.remove('approvalResult')
}
