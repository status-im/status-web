import { useEffect, useState } from 'react'

import {
  decodeCommunityURLData,
  deserializePublicKey,
  indicesToTags,
  verifyEncodedURLData,
} from '@status-im/js'

import { ErrorPage } from '@/components/error-page'
import { PreviewPage } from '@/components/page'
import { ERROR_CODES } from '@/consts/error-codes'
import { useWaku } from '@/hooks/use-waku'
import { createGetServerSideProps } from '@/server/ssr'

import type { Client } from '@/hooks/use-waku'
import type { ServerSideProps } from '@/server/ssr'

export const getServerSideProps = createGetServerSideProps(
  decodeCommunityURLData
)

const getOgImageUrl = (unverifiedData?: any) => {
  if (!unverifiedData) {
    return ''
  }

  const searchParams = new URLSearchParams({
    displayName: unverifiedData.displayName,
    description: unverifiedData.description,
    membersCount: unverifiedData.membersCount,
    color: unverifiedData.color,
    // tags: indicesToTags(unverifiedData.tagIndices),
  })

  return `${
    process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
  }/api/c/og?${searchParams.toString()}`
}

export default function CommunityPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeCommunityURLData>>
) {
  // todo?: merge error, data, and publicKey into single effect
  const [error, setError] = useState<number>(props.errorCode)
  const [data, setData] =
    useState<Awaited<ReturnType<Client['fetchCommunity']>>>()
  const [publicKey, setPublicKey] = useState<string>()

  // todo: set constrains on url data (e.g. max lenght, byte)
  // todo: decoded url data againts schema (e.g. lenght)
  useEffect(() => {
    console.log('key')

    try {
      if (!props.unverifiedData) {
        // todo?: extend spec for more than just public key after #
        const hash = window.location.hash.replace('#', '')
        try {
          const publicKey = deserializePublicKey(hash)

          setPublicKey(publicKey)

          return
        } catch (error) {
          // return
        }
      }

      // todo: encode signatrue and public key | ens name, and update spec
      const [urlSignature, publicKey] = window.location.hash
        .replace('#', '')
        .split(';')

      if (!urlSignature || !publicKey) {
        setError(ERROR_CODES.UNVERIFIED_CONTENT)

        return
      }

      if (
        !verifyEncodedURLData(urlSignature, props.encodedData /*, publicKey */)
      ) {
        setError(ERROR_CODES.UNVERIFIED_CONTENT)

        return
      }

      // fixme!: set only verified data
      setData(props.unverifiedData)
      setPublicKey(deserializePublicKey(publicKey))
    } catch (error) {
      console.error(error)

      setError(ERROR_CODES.INTERNAL_SERVER_ERROR)
    }
  }, [])

  // todo?: provider, reducer
  // todo?: return status
  // const client = useWaku(publicKey, async client => {
  //   const data = await client.fetchCommunity(publicKey)

  //   if (!data) {
  //     return
  //   }

  //   setData(data)
  // })

  // const handleRetry = async () => {
  //   const data = await client.fetchCommunity(publicKey)

  //   if (!data) {
  //     return
  //   }

  //   setData(data)
  // }

  // return

  // todo?: pass meta, info as component
  // todo?: pass image, color as props

  if (error) {
    return <ErrorPage errorCode={error} />
  }

  const ogImageUrl = getOgImageUrl(props.unverifiedData)

  return (
    <PreviewPage
      type="community"
      verifiedData={data}
      ogImageUrl={ogImageUrl}
      // onRetry={handleRetry}
    >
      {/* <>
        <title>Status - Community</title>
        {props.unverifiedData &&
          (() => {
            // todo?: pass through encoded data from server props instead
            const searchParams = new URLSearchParams({
              displayName: props.unverifiedData.displayName,
              description: props.unverifiedData.description,
              membersCount: props.unverifiedData.membersCount,
              color: props.unverifiedData.color,
              // tags: indicesToTags(props.unverifiedData.tagIndices),
            })

            return (
              <meta
                property="og:image"
                content={`${
                  process.env.VERCEL_URL
                    ? 'https://' + process.env.VERCEL_URL
                    : ''
                }/api/c/og?${searchParams.toString()}`}
              />
            )
          })()}
      </> */}
    </PreviewPage>
  )
}
