'use client'

import { useCallback, useEffect, useState } from 'react'

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

type BranchSyncComparison = {
  aheadBy: number
  behindBy?: number
  productionBranch: string
  productionSha: string
  stagingBranch: string
  stagingSha: string
  status: string
}

type BranchSyncResponse = {
  comparison?: BranchSyncComparison
  decision?: BranchSyncDecision
  error?: string
  updated?: boolean
}

const shortSha = (sha?: string): string =>
  sha && sha.length > 7 ? sha.slice(0, 7) : (sha ?? 'unknown')

const getStatusText = (response: BranchSyncResponse | null): string => {
  if (!response) return 'Checking branch state...'
  if (response.error) return `Sync status unavailable: ${response.error}`
  if (!response.comparison || !response.decision)
    return 'Sync status unavailable'

  const { comparison, decision } = response
  if (response.updated) {
    return `${comparison.productionBranch} synced to ${comparison.stagingBranch}.`
  }
  if (decision.kind === 'already-synced') {
    return `${comparison.productionBranch} already matches ${comparison.stagingBranch} at ${shortSha(
      decision.sha
    )}.`
  }
  if (decision.kind === 'fast-forward') {
    return `${comparison.productionBranch} can fast-forward by ${comparison.aheadBy} commit${
      comparison.aheadBy === 1 ? '' : 's'
    } to ${shortSha(decision.sha)}.`
  }
  return decision.reason
}

export const ProductionSyncPanel = () => {
  const [response, setResponse] = useState<BranchSyncResponse | null>(null)
  const [pending, setPending] = useState(false)

  const fetchStatus = useCallback(async () => {
    setPending(true)
    try {
      const res = await fetch('/api/content-workflow/sync-production', {
        credentials: 'same-origin',
      })
      const json = (await res.json()) as BranchSyncResponse
      setResponse(
        res.ok
          ? json
          : {
              error: json.error ?? `request failed (${res.status})`,
            }
      )
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setPending(false)
    }
  }, [])

  const onSync = useCallback(async () => {
    setPending(true)
    try {
      const res = await fetch('/api/content-workflow/sync-production', {
        credentials: 'same-origin',
        method: 'POST',
      })
      const json = (await res.json()) as BranchSyncResponse
      setResponse(
        res.ok
          ? json
          : {
              ...json,
              error: json.error,
            }
      )
    } catch (error) {
      setResponse({
        error: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setPending(false)
    }
  }, [])

  useEffect(() => {
    void fetchStatus()
  }, [fetchStatus])

  const canSync =
    response?.decision?.kind === 'fast-forward' && response.updated !== true

  return (
    <div
      style={{
        alignItems: 'center',
        background: 'var(--theme-elevation-50, #f7f7f7)',
        border: '1px solid var(--theme-elevation-150, #dcdcdc)',
        borderRadius: 6,
        display: 'flex',
        gap: 12,
        justifyContent: 'space-between',
        marginBottom: 'var(--base, 16px)',
        padding: '12px 16px',
      }}
    >
      <div style={{ fontSize: 13 }}>
        <strong>Production branch sync</strong>
        <div style={{ marginTop: 4, opacity: 0.78 }}>
          {getStatusText(response)}
        </div>
      </div>
      <button
        type="button"
        disabled={!canSync || pending}
        onClick={() => void onSync()}
        style={{
          border: '1px solid var(--theme-elevation-300, #b8b8b8)',
          borderRadius: 4,
          background: 'var(--theme-bg, #fff)',
          color: 'inherit',
          cursor: !canSync || pending ? 'not-allowed' : 'pointer',
          flexShrink: 0,
          fontSize: 13,
          fontWeight: 700,
          padding: '8px 12px',
        }}
      >
        {pending ? 'Syncing...' : 'Sync production'}
      </button>
    </div>
  )
}

export default ProductionSyncPanel
