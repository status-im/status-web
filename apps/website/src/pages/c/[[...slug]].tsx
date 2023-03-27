import { useEffect } from 'react'

import { useToast } from '@status-im/components'
import { decodeCommunityURLData } from '@status-im/js/encode-url-data'

import { ErrorPage } from '@/components/error-page'
import { PreviewPage } from '@/components/preview-page'
import { ERROR_CODES } from '@/consts/error-codes'
import { useURLData } from '@/hooks/use-url-data'
import { useWakuData } from '@/hooks/use-waku'
import { createGetServerSideProps } from '@/server/ssr'

import type { ServerSideProps } from '@/server/ssr'
import type { CommunityInfo } from '@status-im/js'

export const getServerSideProps = createGetServerSideProps(
  decodeCommunityURLData
)

// const getOgImageUrl = (unverifiedData?: any) => {
//   if (!unverifiedData) {
//     return ''
//   }

//   const searchParams = new URLSearchParams({
//     displayName: unverifiedData.displayName,
//     description: unverifiedData.description,
//     membersCount: unverifiedData.membersCount,
//     color: unverifiedData.color,
//     // tags: indicesToTags(unverifiedData.tagIndices),
//   })

//   return `${
//     process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : ''
//   }/api/c/og?${searchParams.toString()}`
// }

export default function CommunityPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeCommunityURLData>>
) {
  const {
    publicKey,
    verifiedURLData,
    error: urlError,
  } = useURLData<CommunityInfo>(props.unverifiedData, props.encodedData)

  const {
    verifiedWakuData,
    error: wakuError,
    loading,
    refetch,
  } = useWakuData<CommunityInfo>('community', publicKey)

  const toast = useToast()

  const data = verifiedURLData ?? verifiedWakuData

  if (!data && props.errorCode) {
    return <ErrorPage errorCode={props.errorCode} />
  }

  if (urlError) {
    return <ErrorPage errorCode={ERROR_CODES[urlError]} />
  }

  // todo?: call only on client, from within useEffect
  if (wakuError) {
    toast.negative("Couldn't fetch information", {
      action: 'Retry',
      onAction: refetch,
    })
  }

  // if (!verifiedWakuData && !loading) {
  //   toast.negative("Couldn't fetch information", {
  //     action: 'Retry',
  //     onAction: refetch,
  //   })
  // }

  useEffect(() => {
    if (!loading && !verifiedWakuData) {
      toast.negative("Couldn't fetch information", {
        action: 'Retry',
        onAction: refetch,
      })
    }
  }, [loading])

  // todo?: skeleton only if no data
  // if (loading) {
  //   return <PreviewPage loading />
  // }

  // todo: default og image, not dynamic
  // const ogImageUrl = getOgImageUrl(props.unverifiedData)

  return (
    // todo?: pass meta, info as component
    // todo?: pass image, color as props
    <PreviewPage
      type="community"
      verifiedData={data}
      ogImageUrl=""
      // ogImageUrl={ogImageUrl}
      // onRetry={handleRetry}
    />
    //   {/* <>
    //     <title>Status - Community</title>
    //     {props.unverifiedData &&
    //       (() => {
    //         // todo?: pass through encoded data from server props instead
    //         const searchParams = new URLSearchParams({
    //           displayName: props.unverifiedData.displayName,
    //           description: props.unverifiedData.description,
    //           membersCount: props.unverifiedData.membersCount,
    //           color: props.unverifiedData.color,
    //           // tags: indicesToTags(props.unverifiedData.tagIndices),
    //         })

    //         return (
    //           <meta
    //             property="og:image"
    //             content={`${
    //               process.env.VERCEL_URL
    //                 ? 'https://' + process.env.VERCEL_URL
    //                 : ''
    //             }/api/c/og?${searchParams.toString()}`}
    //           />
    //         )
    //       })()}
    //   </> */}
    // </PreviewPage>
  )
}
