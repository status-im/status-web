import { useEffect } from 'react'

import { useToast } from '@status-im/components'
import { decodeUserURLData } from '@status-im/js/encode-url-data'

import { ErrorPage } from '@/components/error-page'
import { PreviewPage } from '@/components/preview-page'
import { ERROR_CODES } from '@/consts/error-codes'
import { useURLData } from '@/hooks/use-url-data'
import { useWakuData } from '@/hooks/use-waku'
import { createGetServerSideProps } from '@/server/ssr'

import type { ServerSideProps } from '@/server/ssr'
import type { UserInfo } from '@status-im/js'

export const getServerSideProps = createGetServerSideProps(decodeUserURLData)

export default function UserPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeUserURLData>>
) {
  const {
    publicKey,
    verifiedURLData,
    error: urlError,
  } = useURLData<UserInfo>(props.unverifiedData, props.encodedData)

  const {
    verifiedWakuData,
    error: wakuError,
    loading,
    refetch,
  } = useWakuData<UserInfo>('profile', publicKey, '123')

  const toast = useToast()

  const data = verifiedURLData ?? verifiedWakuData

  if (!data && props.errorCode) {
    return <ErrorPage errorCode={props.errorCode} />
  }

  if (urlError) {
    return <ErrorPage errorCode={ERROR_CODES[urlError]} />
  }

  if (wakuError) {
    toast.negative("Couldn't fetch information", {
      action: 'Retry',
      onAction: refetch,
    })
  }

  useEffect(() => {
    if (!loading && !verifiedWakuData) {
      toast.negative("Couldn't fetch information", {
        action: 'Retry',
        onAction: refetch,
      })
    }
  }, [loading])

  return (
    <PreviewPage
      type="profile"
      publicKey={publicKey}
      verifiedData={data}
      ogImageUrl=""
    />
  )
}
