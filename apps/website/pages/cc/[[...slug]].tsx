import { useEffect,useState } from 'react'

import { Avatar, Button, Heading,Paragraph } from '@status-im/components'
import { decodeChannelURLData, deserializePublicKey } from '@status-im/js'

import { PreviewPage } from '@/components/page'
import { useWaku } from '@/hooks/use-waku'
import { createGetServerSideProps } from '@/server/ssr'

import type { Client} from '@/hooks/use-waku';
import type { ServerSideProps } from '@/server/ssr';

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
          <Heading>#{data.displayName}</Heading>
          <Paragraph>{data.description}</Paragraph>
          <div>
            <Paragraph>Channel in</Paragraph>
            {/* todo: Status logo */}
            <div>
              <Avatar
                src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80"
                size={80}
              />
              <Paragraph>{data.community.displayName}</Paragraph>
            </div>
          </div>

          <div>
            <Heading heading="h2">How to join this channel:</Heading>
            <ol>
              <li>
                <div>
                  <Button size={24}>Download</Button>
                  <Paragraph>the Status app</Paragraph>
                </div>
              </li>
              <li>
                <Paragraph>Install Status</Paragraph>
              </li>
              <li>
                <Paragraph>Complete the onboarding</Paragraph>
              </li>
              <li>
                <div>
                  <Button size={24}>View channel in Status</Button>
                  <div>
                    <Paragraph>and voilá</Paragraph>
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
