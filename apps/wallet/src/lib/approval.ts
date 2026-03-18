export type PendingApproval =
  | {
      id: string
      type: 'eth_requestAccounts'
      origin: string
      title: string
      favicon: string
      address: string
      chainId: string
    }
  | {
      id: string
      type: 'personal_sign'
      origin: string
      title: string
      favicon: string
      address: string
      chainId: string
      message: string
    }

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
  return (result.pendingApproval as PendingApproval) || null
}

export async function clearPendingApproval(): Promise<void> {
  await chrome.storage.session.remove('pendingApproval')
}

export async function setApprovalResult(result: ApprovalResult): Promise<void> {
  await chrome.storage.session.set({ approvalResult: result })
}

export async function clearApprovalResult(): Promise<void> {
  await chrome.storage.session.remove('approvalResult')
}
