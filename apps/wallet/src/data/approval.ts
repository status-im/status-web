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
