import { Octokit } from '@octokit/rest'
import { track } from '@vercel/analytics/server'
import { NextResponse } from 'next/server'
import { match } from 'ts-pattern'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const octokit = new Octokit()

const querySchema = z.object({
  platform: z.enum([
    'macos-silicon',
    'macos-intel',
    'linux',
    'windows',
    'android',
  ]),
})

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ platform: string }> }
) {
  const result = querySchema.safeParse({
    platform: (await params).platform,
  })

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  const { platform } = result.data

  if (platform === 'android') {
    const release = await octokit.repos.getLatestRelease({
      owner: 'status-im',
      repo: 'status-mobile',
    })

    await track('Download', {
      platform: 'android',
      version: release.data.tag_name,
      store: 'direct',
    })

    const { browser_download_url: downloadUrl } = release.data.assets.find(
      asset => asset.name.endsWith('universal.apk')
    )!

    return NextResponse.redirect(downloadUrl)
  }

  try {
    const release = await octokit.repos.getLatestRelease({
      owner: 'status-im',
      repo: 'status-desktop',
    })

    // @see https://github.com/status-im/status-desktop/releases
    const { browser_download_url: downloadUrl } = match(platform)
      .with(
        'macos-silicon',
        () =>
          release.data.assets.find(asset => asset.name.endsWith('aarch64.dmg'))!
      )
      .with(
        'macos-intel',
        () =>
          release.data.assets.find(asset => asset.name.endsWith('x86_64.dmg'))!
      )
      .with(
        'windows',
        () => release.data.assets.find(asset => asset.name.endsWith('.exe'))!
      )
      .with(
        'linux',
        () =>
          release.data.assets.find(asset =>
            asset.name.endsWith('x86_64.tar.gz')
          )!
      )
      .exhaustive()

    const response = NextResponse.redirect(downloadUrl)

    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=300'
    )

    return response
  } catch (error) {
    console.error('Error occurred:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
