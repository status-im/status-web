import { useEffect, useState } from 'react'

import { decodeUserURLData, deserializePublicKey } from '@status-im/js'

import { ErrorPage } from '@/components/error-page'
import { PreviewPage } from '@/components/page'
import { useWaku } from '@/hooks/use-waku'
import { createGetServerSideProps } from '@/server/ssr'

import type { ServerSideProps } from '@/server/ssr'
import type { UserInfo } from '@status-im/js'

export const getServerSideProps = createGetServerSideProps(decodeUserURLData)

export default function UserPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeUserURLData>>
) {
  const [error, setError] = useState<number>(props.errorCode)
  const [data, setData] = useState<UserInfo>()
  const [publicKey, setPublicKey] = useState<string>()

  // todo: use effects like for community but with exception of resooving ENS
  useEffect(() => {
    const [urlSignature, publicKey] = window.location.hash
      .replace('#', '')
      .split(';')

    // fixme!: set only verified data
    setData(props.unverifiedData)
    setPublicKey(deserializePublicKey(publicKey))
  }, [])

  // todo: use client like for community

  if (error) {
    return <ErrorPage errorCode={error} />
  }

  return (
    <PreviewPage
      type="profile"
      verifiedData={data}
      publicKey={publicKey}
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
    </PreviewPage>
  )
}
