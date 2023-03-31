import { useEffect, useState } from 'react'

import { Avatar, Button, Text } from '@status-im/components'
import { decodeChannelURLData, deserializePublicKey } from '@status-im/js'

import { PreviewPage } from '@/components/page'
import { useWaku } from '@/hooks/use-waku'
import { createGetServerSideProps } from '@/server/ssr'

import type { Client } from '@/hooks/use-waku'
import type { ServerSideProps } from '@/server/ssr'

export const getServerSideProps = createGetServerSideProps(decodeChannelURLData)

export default function ChannelPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeChannelURLData>>
) {
  const [error, setError] = useState<number>()
  const [data, setData] = useState<Awaited<ReturnType<Client['fetchChannel']>>>(
    props.unverifiedData
  )
  const [publicKey, setPublicKey] = useState<string>()

  // todo: use effects like for community

  // todo: use client like for community

  return (
    <PreviewPage
      errorCode={error || props.errorCode}
      unverifiedData={props.unverifiedData}
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
          <Avatar
            src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80"
            size={80}
          />
          <Text size={13}>#{data.displayName}</Text>
          <Text size={13}>{data.description}</Text>
          <div>
            <Text size={13}>Channel in</Text>
            {/* todo: Status logo */}
            <div>
              <Avatar
                src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80"
                size={80}
              />
              <Text>{data.community.displayName}</Text>
            </div>
          </div>

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
