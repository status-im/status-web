import { NextResponse } from 'next/server'
import { match } from 'ts-pattern'
import { z } from 'zod'

import { getLatestRelease } from '~server/services/github'
import { track } from '~server/services/umami'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
  request: Request,
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
    const release = await getLatestRelease({ repo: 'status-app' })

    await track(
      'Download',
      {
        platform: 'android',
        version: release.tag_name,
        store: 'direct',
      },
      request
    )

    const { browser_download_url: downloadUrl } = release.assets.find(asset =>
      asset.name.endsWith('arm64.apk')
    )!

    return NextResponse.redirect(downloadUrl)
  }

  try {
    const release = await getLatestRelease({ repo: 'status-app' })

    // @see https://github.com/status-im/status-app/releases
    const { browser_download_url: downloadUrl } = match(platform)
      .with(
        'macos-silicon',
        () => release.assets.find(asset => asset.name.endsWith('aarch64.dmg'))!
      )
      .with(
        'macos-intel',
        () => release.assets.find(asset => asset.name.endsWith('x86_64.dmg'))!
      )
      .with(
        'windows',
        () => release.assets.find(asset => asset.name.endsWith('.exe'))!
      )
      .with(
        'linux',
        () =>
          release.assets.find(asset => asset.name.endsWith('x86_64.tar.gz'))!
      )
      .exhaustive()

    await track(
      'Download',
      { platform, version: release.tag_name, store: 'direct' },
      request
    )

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
