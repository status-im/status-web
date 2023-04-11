import { useEffect, useState } from 'react'

import { decodeChannelURLData, deserializePublicKey } from '@status-im/js'

import { ErrorPage } from '@/components/error-page'
import { PreviewPage } from '@/components/page'
import { useWaku } from '@/hooks/use-waku'
import { createGetServerSideProps } from '@/server/ssr'

import type { Client } from '@/hooks/use-waku'
import type { ServerSideProps } from '@/server/ssr'

export const getServerSideProps = createGetServerSideProps(decodeChannelURLData)

export default function ChannelPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeChannelURLData>>
) {
  const [error, setError] = useState<number>(props.errorCode)
  const [data, setData] = useState<Awaited<ReturnType<Client['fetchChannel']>>>(
    props.unverifiedData
  )
  const [publicKey, setPublicKey] = useState<string>()

  // todo: use effects like for community

  // todo: use client like for community

  if (error) {
    return <ErrorPage errorCode={error} />
  }

  return (
    <PreviewPage
      type="channel"
      verifiedData={data}
      // onRetry={handleRetry}
    >
      <>
        <title>Status - Channel</title>
        {props.unverifiedData &&
          (() => {
            const searchParams = new URLSearchParams({
              displayName: props.unverifiedData.displayName,
              description: props.unverifiedData.description,
              emoji: props.unverifiedData.emoji,
              color: props.unverifiedData.color,
            })

            return (
              <meta
                property="og:image"
                content={`${
                  process.env.VERCEL_URL
                    ? 'https://' + process.env.VERCEL_URL
                    : ''
                }/api/cc/og?${searchParams.toString()}`}
              />
            )
          })()}
      </>
    </PreviewPage>
  )
}
