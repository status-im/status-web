import { ProviderRpcError } from '@status-im/ethereum-provider'

import {
  APPROVAL_TIMEOUT_MS,
  type ApprovalResult,
  clearApprovalResult,
  clearPendingApproval,
  getApprovalResult,
  type PendingApproval,
  setPendingApproval,
} from '../../data/approval'

const APPROVAL_POPUP_WIDTH = 390
const APPROVAL_POPUP_HEIGHT = 628

type PendingApprovalInput = PendingApproval extends infer T
  ? T extends PendingApproval
    ? Omit<T, 'id' | 'createdAt'>
    : never
  : never

/**
 * Synchronous claim on the single approval slot.
 */
let approvalInFlight = false

export function requestApproval(
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
