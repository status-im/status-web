import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'

import { loadGithubConfigFromEnv, setGithubConfig } from '@status-im/content/github'

import { mergeContentPullRequest } from '@/services/content-workflow'

type PayloadClient = Awaited<ReturnType<typeof getPayload>>

export interface MergePrRouteDependencies {
  getPayload: () => Promise<PayloadClient>
  loadGithubConfigFromEnv: typeof loadGithubConfigFromEnv
  mergeContentPullRequest: typeof mergeContentPullRequest
  setGithubConfig: typeof setGithubConfig
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error)

const loadGithubConfigResponse = ({
  loadGithubConfigFromEnv,
  setGithubConfig,
}: Pick<
  MergePrRouteDependencies,
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

const parsePullRequestNumber = async (
  req: NextRequest
): Promise<NextResponse | number> => {
  let body: { pullRequestNumber?: number }
  try {
    body = (await req.json()) as { pullRequestNumber?: number }
  } catch {
    return NextResponse.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  if (
    !Number.isInteger(body.pullRequestNumber) ||
    Number(body.pullRequestNumber) < 1
  ) {
    return NextResponse.json(
      { error: 'missing or invalid "pullRequestNumber"' },
      { status: 400 }
    )
  }

  return Number(body.pullRequestNumber)
}

export const createMergePrPostHandler =
  ({
    getPayload,
    loadGithubConfigFromEnv,
    mergeContentPullRequest,
    setGithubConfig,
  }: MergePrRouteDependencies) =>
  async (req: NextRequest): Promise<NextResponse> => {
    const pullRequestNumberOrResponse = await parsePullRequestNumber(req)
    if (typeof pullRequestNumberOrResponse !== 'number') {
      return pullRequestNumberOrResponse
    }

    const githubConfigResponse = loadGithubConfigResponse({
      loadGithubConfigFromEnv,
      setGithubConfig,
    })
    if (githubConfigResponse) {
      return githubConfigResponse
    }

    const payload = await getPayload()
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
    }

    try {
      const result = await mergeContentPullRequest({
        payload,
        pullRequestNumber: pullRequestNumberOrResponse,
      })
      return NextResponse.json(result)
    } catch (error) {
      return NextResponse.json(
        { error: getErrorMessage(error) },
        { status: 422 }
      )
    }
  }

export const POST = createMergePrPostHandler({
  getPayload: async () => {
    const { default: config } = await import('@payload-config')
    return getPayload({ config })
  },
  loadGithubConfigFromEnv,
  mergeContentPullRequest,
  setGithubConfig,
})
