import {
  decodeUserURLData,
  deserializePublicKey,
  publicKeyToEmojiHash,
} from '@status-im/js'
import { createGetServerSideProps, ServerSideProps } from '@/server/ssr'
import { useWaku } from '@/hooks/use-waku'
import { useState, useEffect } from 'react'
import { PreviewPage } from '@/components/page'
import { Avatar, Paragraph, Button, Heading } from '@status-im/components'

export const getServerSideProps = createGetServerSideProps(decodeUserURLData)

export default function UserPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeUserURLData>>,
) {
  const [error, setError] = useState<number>()
  const [data, setData] = useState(props.unverifiedData)
  const [publicKey, setPublicKey] = useState<string>()

  // todo: use effects like for community but with exception of resooving ENS

  // todo: use client like for community

  return (
    <PreviewPage
      errorCode={error || props.errorCode}
      unverifiedData={props.unverifiedData}
      // onRetry={handleRetry}
    >
      <>
        <title>Status - User</title>
        {props.unverifiedData &&
          (() => {
            const searchParams = new URLSearchParams({
              displayName: props.unverifiedData.displayName,
              description: props.unverifiedData.description,
              color: props.unverifiedData.color,
            })

            return (
              <meta
                property="og:image"
                content={`${
                  process.env.VERCEL_URL
                    ? 'https://' + process.env.VERCEL_URL
                    : ''
                }/api/u/og?${searchParams.toString()}`}
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
          <Heading>{data.displayName}</Heading>
          <Paragraph>{data.description}</Paragraph>
          {/* <Paragraph>{publicKeyToEmojiHash(publicKey)}</Paragraph> */}

          <div>
            <Heading heading="h2">How to connect with this profile:</Heading>
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
                  <Button size={24}>Open profile in Status</Button>
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
