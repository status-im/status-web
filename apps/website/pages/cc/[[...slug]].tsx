import { useEffect, useState } from 'react'

import { Avatar, Button, Text } from '@status-im/components'
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
      {data && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <Text size={27}>How to join this channel:</Text>
            <ol>
              <li>
                <div>
                  <Button size={24}>Download</Button>
                  <Text size={13}>the Status app</Text>
                </div>
              </li>
              <li>
                <Text size={13}>Install Status</Text>
              </li>
              <li>
                <Text size={13}>Complete the onboarding</Text>
              </li>
              <li>
                <div>
                  <Button size={24}>View channel in Status</Button>
                  <div>
                    <Text size={13}>and voilá</Text>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          {/* todo: reuse "QR" component */}
          {/* todo: reuse "powered by" component*/}
        </div>
      )}
    </PreviewPage>
  )
}
