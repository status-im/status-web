import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'

import {
  type BranchSyncComparison,
  type BranchSyncDecision,
  compareProductionToStaging,
  getBranchSyncLinks,
  getBranchSyncDecision,
  loadGithubConfigFromEnv,
  setGithubConfig,
} from '@status-im/content/github'

import { syncProductionToStaging } from '@/services/content-workflow'

type PayloadClient = Awaited<ReturnType<typeof getPayload>>

export interface SyncProductionRouteDependencies {
  compareProductionToStaging: typeof compareProductionToStaging
  getBranchSyncDecision: (
    comparison: BranchSyncComparison
  ) => BranchSyncDecision
  getBranchSyncLinks: typeof getBranchSyncLinks
  getPayload: () => Promise<PayloadClient>
  loadGithubConfigFromEnv: typeof loadGithubConfigFromEnv
  setGithubConfig: typeof setGithubConfig
  syncProductionToStaging: typeof syncProductionToStaging
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error)

const loadGithubConfigResponse = ({
  loadGithubConfigFromEnv,
  setGithubConfig,
}: Pick<
  SyncProductionRouteDependencies,
  'loadGithubConfigFromEnv' | 'setGithubConfig'
>): NextResponse | null => {
  try {
    setGithubConfig(loadGithubConfigFromEnv())
    return null
  } catch (error) {
    return NextResponse.json(
      { error: `GitHub config not loaded: ${getErrorMessage(error)}` },
      { status: 500 }
    )
  }
}

const requireUser = async ({
  getPayload,
  req,
}: {
  getPayload: SyncProductionRouteDependencies['getPayload']
  req: NextRequest
}): Promise<NextResponse | null> => {
  const payload = await getPayload()
  const { user } = await payload.auth({ headers: req.headers })
  return user
    ? null
    : NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
}

export const createSyncProductionHandlers = ({
  compareProductionToStaging,
  getBranchSyncDecision,
  getBranchSyncLinks,
  getPayload,
  loadGithubConfigFromEnv,
  setGithubConfig,
  syncProductionToStaging,
}: SyncProductionRouteDependencies): {
  GET: (req: NextRequest) => Promise<NextResponse>
  POST: (req: NextRequest) => Promise<NextResponse>
} => {
  const GET = async (req: NextRequest): Promise<NextResponse> => {
    const githubConfigResponse = loadGithubConfigResponse({
      loadGithubConfigFromEnv,
      setGithubConfig,
    })
    if (githubConfigResponse) {
      return githubConfigResponse
    }

    const authResponse = await requireUser({ getPayload, req })
    if (authResponse) {
      return authResponse
    }

    try {
      const comparison = await compareProductionToStaging()
      const githubConfig = loadGithubConfigFromEnv()
      return NextResponse.json({
        comparison,
        decision: getBranchSyncDecision(comparison),
        links: getBranchSyncLinks({
          owner: githubConfig.owner,
          repo: githubConfig.repo,
          productionBranch: comparison.productionBranch,
          stagingBranch: comparison.stagingBranch,
        }),
      })
    } catch (error) {
      return NextResponse.json(
        { error: getErrorMessage(error) },
        { status: 502 }
      )
    }
  }

  const POST = async (req: NextRequest): Promise<NextResponse> => {
    const githubConfigResponse = loadGithubConfigResponse({
      loadGithubConfigFromEnv,
      setGithubConfig,
    })
    if (githubConfigResponse) {
      return githubConfigResponse
    }

    const authResponse = await requireUser({ getPayload, req })
    if (authResponse) {
      return authResponse
    }

    try {
      const result = await syncProductionToStaging()
      const status = result.decision.kind === 'blocked' ? 409 : 200
      return NextResponse.json(result, { status })
    } catch (error) {
      return NextResponse.json(
        { error: getErrorMessage(error) },
        { status: 502 }
      )
    }
  }

  return { GET, POST }
}

const handlers = createSyncProductionHandlers({
  compareProductionToStaging,
  getBranchSyncDecision,
  getBranchSyncLinks,
  getPayload: async () => {
    const { default: config } = await import('@payload-config')
    return getPayload({ config })
  },
  loadGithubConfigFromEnv,
  setGithubConfig,
  syncProductionToStaging,
})

export const GET = handlers.GET
export const POST = handlers.POST
