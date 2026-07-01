'use client'

import {
  FormSubmit,
  toast,
  useDocumentInfo,
  useEditDepth,
  useForm,
  useFormFields,
  useFormModified,
  useFormProcessing,
  useHotkey,
  useOperation,
  useTranslation,
} from '@payloadcms/ui'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

import { getContentWorkflowCollection } from '@/services/content-workflow/collection-metadata'

const toastId = 'content-pr-save-in-progress'
const savedToastId = 'content-pr-save-created'

type RecentPullRequest = {
  branchName?: string | null
  draft?: boolean | null
  pullRequestNumber?: number | null
  pullRequestUrl?: string | null
}

type RecentPrResult = {
  pullRequests?: RecentPullRequest[]
  error?: string
}

type LoadRecentPullRequestOptions = {
  notify?: boolean
}

type MergePrResult = {
  error?: string
  pullRequestNumber?: number
  pullRequestUrl?: string
}

type BranchSyncDecision =
  | {
      kind: 'fast-forward'
      sha: string
    }
  | {
      kind: 'already-synced'
      sha: string
    }
  | {
      kind: 'blocked'
      reason: string
    }

type BranchSyncLinks = {
  compareUrl: string
  productionBranchUrl: string
  stagingBranchUrl: string
}

type BranchSyncResponse = {
  decision?: BranchSyncDecision
  error?: string
  links?: BranchSyncLinks
  updated?: boolean
}

const shortSha = (sha?: string): string =>
  sha && sha.length > 7 ? sha.slice(0, 7) : (sha ?? 'unknown')

const getSyncStatusMessage = (
  response: BranchSyncResponse | null
): string | null => {
  if (!response || response.error || !response.decision) return null
  if (response.updated) return 'Production synced to develop.'
  if (response.decision.kind === 'already-synced') {
    return `Production already matches develop at ${shortSha(
      response.decision.sha
    )}.`
  }
  if (response.decision.kind === 'blocked') return response.decision.reason
  return null
}

const useCollectionSlug = (): string | null => {
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/\/collections\/([^/]+)/)
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

const useFormSlug = (): string | undefined =>
  useFormFields(([fields]) => {
    const field = fields?.['slug']
    return typeof field?.value === 'string' ? field.value : undefined
  })

const useFormListingPage = (): string | undefined =>
  useFormFields(([fields]) => {
    const field = fields?.['page']
    return typeof field?.value === 'string' ? field.value : undefined
  })

const buildRecentPrHref = ({
  collection,
  page,
  slug,
}: {
  collection: string
  page?: string
  slug?: string
}): string => {
  const params = new URLSearchParams({ collection })
  if (slug) params.set('slug', slug)
  if (page) params.set('page', page)
  return `/api/content-workflow/recent-pr?${params.toString()}`
}

const actionButtonStyle = ({
  disabled,
}: {
  disabled?: boolean
}): CSSProperties => ({
  border: '1px solid var(--theme-elevation-300, #b8b8b8)',
  borderRadius: 4,
  background: 'var(--theme-bg, #fff)',
  color: 'inherit',
  cursor: disabled ? 'not-allowed' : 'pointer',
  fontSize: 13,
  fontWeight: 700,
  opacity: disabled ? 0.5 : 1,
  padding: '8px 12px',
})

const statusLinkStyle = ({
  tone = 'neutral',
}: {
  tone?: 'neutral' | 'success'
}): CSSProperties => ({
  color:
    tone === 'success'
      ? 'var(--theme-success-700, #1e6b3a)'
      : 'var(--theme-elevation-800, #333)',
  fontSize: 12,
  fontWeight: 700,
  textDecoration: 'underline',
  whiteSpace: 'nowrap',
})

const statusTextStyle = ({
  tone = 'neutral',
}: {
  tone?: 'error' | 'neutral' | 'success' | 'warning'
}): CSSProperties => ({
  color:
    tone === 'error'
      ? 'var(--theme-error-700, #b00020)'
      : tone === 'success'
        ? 'var(--theme-success-700, #1e6b3a)'
        : tone === 'warning'
          ? 'var(--theme-warning-700, #8a5a00)'
          : 'var(--theme-elevation-650, #555)',
  fontSize: 12,
  fontWeight: tone === 'neutral' ? 500 : 700,
  whiteSpace: 'nowrap',
})

const toastContentStyle: CSSProperties = {
  alignItems: 'center',
  display: 'inline-flex',
  flexWrap: 'wrap',
  gap: 6,
}

const toastLinkStyle: CSSProperties = {
  color: 'inherit',
  cursor: 'pointer',
  fontWeight: 700,
  textDecoration: 'underline',
}

const getPullRequestLabel = (pullRequest: RecentPullRequest): string =>
  `PR #${pullRequest.pullRequestNumber ?? '?'}`

const getPullRequestToastContent = (
  pullRequest: RecentPullRequest
): ReactNode => {
  if (!pullRequest.pullRequestUrl) return 'Pull request created.'

  return (
    <span style={toastContentStyle}>
      <span>Pull request ready:</span>
      <a
        href={pullRequest.pullRequestUrl}
        rel="noopener noreferrer"
        style={toastLinkStyle}
        target="_blank"
      >
        {getPullRequestLabel(pullRequest)}
      </a>
    </span>
  )
}

const LoadingIcon = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    height="14"
    viewBox="0 0 16 16"
    width="14"
  >
    <circle
      cx="8"
      cy="8"
      fill="none"
      opacity="0.3"
      r="6"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M14 8a6 6 0 0 0-6-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
    >
      <animateTransform
        attributeName="transform"
        dur="0.8s"
        from="0 8 8"
        repeatCount="indefinite"
        to="360 8 8"
        type="rotate"
      />
    </path>
  </svg>
)

export const ContentPrSaveButton = () => {
  const { uploadStatus } = useDocumentInfo()
  const { submit } = useForm()
  const { t } = useTranslation()
  const collection = useCollectionSlug()
  const listingPage = useFormListingPage()
  const slug = useFormSlug()
  const modified = useFormModified()
  const processing = useFormProcessing()
  const editDepth = useEditDepth()
  const operation = useOperation()
  const ref = useRef<HTMLButtonElement | null>(null)
  const sawProcessingRef = useRef(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [recentPr, setRecentPr] = useState<RecentPullRequest | null>(null)
  const [recentPrError, setRecentPrError] = useState<string | null>(null)
  const [mergeResult, setMergeResult] = useState<MergePrResult | null>(null)
  const [merging, setMerging] = useState(false)
  const [syncResponse, setSyncResponse] = useState<BranchSyncResponse | null>(
    null
  )
  const [syncing, setSyncing] = useState(false)
  const [statusPanelDismissed, setStatusPanelDismissed] = useState(false)

  const disabled =
    (operation === 'update' && !modified) || uploadStatus === 'uploading'
  const pending = showFeedback || processing

  const startFeedback = () => {
    setShowFeedback(true)
    sawProcessingRef.current = false
    toast.loading('Creating pull request...', { id: toastId })
  }

  const loadSyncStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/content-workflow/sync-production', {
        credentials: 'same-origin',
      })
      const json = (await response.json()) as BranchSyncResponse
      setSyncResponse(
        response.ok
          ? json
          : { error: json.error ?? `request failed (${response.status})` }
      )
    } catch (error) {
      setSyncResponse({
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }, [])

  const loadRecentPullRequest = useCallback(
    async ({ notify = false }: LoadRecentPullRequestOptions = {}) => {
      if (!collection) return

      try {
        const response = await fetch(
          buildRecentPrHref({ collection, page: listingPage, slug }),
          {
            credentials: 'same-origin',
          }
        )
        const json = (await response.json()) as RecentPrResult
        if (!response.ok) {
          throw new Error(json.error ?? `request failed (${response.status})`)
        }

        const pullRequest = json.pullRequests?.[0] ?? null
        setRecentPr(pullRequest)
        setRecentPrError(null)
        if (notify && pullRequest) {
          toast.success(getPullRequestToastContent(pullRequest), {
            duration: 10000,
            id: savedToastId,
          })
        }
      } catch (error) {
        setRecentPr(null)
        setRecentPrError(error instanceof Error ? error.message : String(error))
      }
    },
    [collection, listingPage, slug]
  )

  const stopFeedback = () => {
    setShowFeedback(false)
    sawProcessingRef.current = false
    toast.dismiss(toastId)
  }

  useEffect(() => {
    if (!showFeedback) return

    if (processing) {
      sawProcessingRef.current = true
      return
    }

    const timeout = window.setTimeout(
      () => {
        stopFeedback()
        void loadRecentPullRequest({ notify: true })
        void loadSyncStatus()
      },
      sawProcessingRef.current ? 0 : 800
    )

    return () => window.clearTimeout(timeout)
  }, [loadRecentPullRequest, loadSyncStatus, processing, showFeedback])

  useEffect(() => {
    void loadRecentPullRequest()
    void loadSyncStatus()
  }, [loadRecentPullRequest, loadSyncStatus])

  useEffect(() => {
    setStatusPanelDismissed(false)
  }, [collection, listingPage, slug])

  useHotkey(
    {
      cmdCtrlKey: true,
      editDepth,
      keyCodes: ['s'],
    },
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      if (!disabled) {
        ref.current?.click()
      }
    }
  )

  const handleSubmit = () => {
    if (uploadStatus === 'uploading') return

    setStatusPanelDismissed(false)
    setRecentPr(null)
    setRecentPrError(null)
    setMergeResult(null)
    startFeedback()
    return void submit()
  }

  const onMerge = async () => {
    if (!recentPr?.pullRequestNumber) return

    setStatusPanelDismissed(false)
    setMerging(true)
    setMergeResult(null)
    try {
      const response = await fetch('/api/content-workflow/merge-pr', {
        body: JSON.stringify({ pullRequestNumber: recentPr.pullRequestNumber }),
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })
      const json = (await response.json()) as MergePrResult
      if (!response.ok) {
        throw new Error(json.error ?? `request failed (${response.status})`)
      }

      setMergeResult(json)
      setRecentPr(null)
      await loadSyncStatus()
    } catch (error) {
      setMergeResult({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setMerging(false)
    }
  }

  const onSync = async () => {
    setStatusPanelDismissed(false)
    setSyncing(true)
    try {
      const response = await fetch('/api/content-workflow/sync-production', {
        credentials: 'same-origin',
        method: 'POST',
      })
      const json = (await response.json()) as BranchSyncResponse
      setSyncResponse(
        response.ok
          ? json
          : {
              ...json,
              error: json.error ?? `request failed (${response.status})`,
            }
      )
    } catch (error) {
      setSyncResponse({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setSyncing(false)
    }
  }

  const supportedCollection = collection
    ? Boolean(getContentWorkflowCollection(collection))
    : false
  const canMerge = supportedCollection && Boolean(recentPr?.pullRequestNumber)
  const syncStatusMessage = getSyncStatusMessage(syncResponse)
  const canSync =
    syncResponse?.decision?.kind === 'fast-forward' &&
    syncResponse.updated !== true
  const hasStatusDetails =
    !statusPanelDismissed &&
    Boolean(
      recentPr?.pullRequestUrl ||
      recentPr?.draft ||
      mergeResult?.pullRequestUrl ||
      syncResponse?.links?.productionBranchUrl ||
      syncResponse?.links?.compareUrl ||
      syncStatusMessage ||
      recentPrError ||
      mergeResult?.error ||
      syncResponse?.error
    )

  return (
    <div
      style={{
        alignItems: 'flex-end',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        position: 'relative',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'flex-end',
        }}
      >
        <FormSubmit
          buttonId="action-save"
          disabled={disabled}
          extraButtonProps={{ style: { minWidth: 120 } }}
          onClick={handleSubmit}
          ref={ref}
          size="medium"
          type="button"
        >
          <span
            style={{
              alignItems: 'center',
              display: 'inline-flex',
              gap: 8,
              justifyContent: 'center',
            }}
          >
            {pending ? <LoadingIcon /> : null}
            <span>{pending ? 'Creating PR...' : t('general:save')}</span>
          </span>
        </FormSubmit>
        <button
          type="button"
          disabled={!canMerge || merging}
          onClick={() => void onMerge()}
          style={actionButtonStyle({ disabled: !canMerge || merging })}
        >
          {merging ? 'Merging...' : 'Merge'}
        </button>
        <button
          type="button"
          disabled={!canSync || syncing}
          onClick={() => void onSync()}
          style={actionButtonStyle({ disabled: !canSync || syncing })}
        >
          {syncing ? 'Syncing...' : 'Sync production'}
        </button>
      </div>
      {hasStatusDetails ? (
        <div
          style={{
            alignItems: 'center',
            background: 'var(--theme-bg, #fff)',
            border: '1px solid var(--theme-elevation-150, #dcdcdc)',
            borderRadius: 4,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 12px',
            justifyContent: 'flex-end',
            maxWidth: 'min(920px, calc(100vw - 96px))',
            padding: '6px 6px 6px 8px',
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 8px)',
            zIndex: 2,
          }}
        >
          {recentPr?.pullRequestUrl ? (
            <a
              href={recentPr.pullRequestUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={statusLinkStyle({ tone: 'success' })}
            >
              PR #{recentPr.pullRequestNumber ?? '?'}
            </a>
          ) : null}
          {recentPr?.draft ? (
            <span style={statusTextStyle({ tone: 'warning' })}>Draft PR</span>
          ) : null}
          {mergeResult?.pullRequestUrl ? (
            <a
              href={mergeResult.pullRequestUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={statusLinkStyle({ tone: 'success' })}
            >
              Merged PR #{mergeResult.pullRequestNumber ?? '?'}
            </a>
          ) : null}
          {syncResponse?.links?.productionBranchUrl ? (
            <a
              href={syncResponse.links.productionBranchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={statusLinkStyle({})}
            >
              Production branch
            </a>
          ) : null}
          {syncResponse?.links?.compareUrl ? (
            <a
              href={syncResponse.links.compareUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={statusLinkStyle({})}
            >
              Compare
            </a>
          ) : null}
          {syncStatusMessage ? (
            <span
              style={statusTextStyle({
                tone:
                  syncResponse?.decision?.kind === 'blocked'
                    ? 'error'
                    : 'success',
              })}
            >
              {syncStatusMessage}
            </span>
          ) : null}
          {recentPrError ? (
            <span
              style={statusTextStyle({ tone: 'error' })}
              title={recentPrError}
            >
              PR lookup failed: {recentPrError}
            </span>
          ) : null}
          {mergeResult?.error ? (
            <span style={statusTextStyle({ tone: 'error' })}>Merge failed</span>
          ) : null}
          {recentPr?.draft ? (
            <span style={statusTextStyle({ tone: 'warning' })}>
              Merge will mark it ready for review first.
            </span>
          ) : null}
          {syncResponse?.error ? (
            <span
              style={statusTextStyle({ tone: 'error' })}
              title={syncResponse.error}
            >
              Sync unavailable: {syncResponse.error}
            </span>
          ) : null}
          <button
            type="button"
            aria-label="Hide status panel"
            onClick={() => setStatusPanelDismissed(true)}
            style={{
              alignItems: 'center',
              background: 'transparent',
              border: 0,
              borderRadius: 3,
              color: 'var(--theme-elevation-650, #555)',
              cursor: 'pointer',
              display: 'inline-flex',
              fontSize: 16,
              height: 22,
              justifyContent: 'center',
              lineHeight: 1,
              padding: 0,
              width: 22,
            }}
          >
            ×
          </button>
        </div>
      ) : null}
    </div>
  )
}
