import { useEffect, useState } from 'react'

import { Avatar, Button, Text } from '@status-im/components'
import {
  decodeCommunityURLData,
  deserializePublicKey,
  indicesToTags,
  verifyEncodedURLData,
} from '@status-im/js'

import { GroupIcon } from '@/../../packages/icons/16'
import { PreviewPage } from '@/components/page'
import { ERROR_CODES } from '@/consts/error-codes'
import { useWaku } from '@/hooks/use-waku'
import { createGetServerSideProps } from '@/server/ssr'

import type { Client } from '@/hooks/use-waku'
import type { ServerSideProps } from '@/server/ssr'

export const getServerSideProps = createGetServerSideProps(
  decodeCommunityURLData
)

export default function CommunityPreviewPage(
  props: ServerSideProps<ReturnType<typeof decodeCommunityURLData>>
) {
  // todo?: merge error, data, and publicKey into single effect
  const [error, setError] = useState<number>()
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

      if (!verifyEncodedURLData(urlSignature, props.encodedData, publicKey)) {
        setError(ERROR_CODES.UNVERIFIED_CONTENT)

        return
      }

      // fixme!: set only verified data
      setData(props.unverifiedData)
      setPublicKey(publicKey)
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
  return (
    <PreviewPage
      errorCode={error || props.errorCode}
      unverifiedData={props.unverifiedData}
      // onRetry={handleRetry}
      // verifiedData={data}
    >
      <>
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
      </>
      {/* {null} */}
      {/* {data && <>{JSON.stringify(data)}</>} */}
      {data && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Avatar
              src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80"
              size={80}
              indicator="online"
            />
            <Text size={64} weight="semibold">
              {data.displayName}
            </Text>
            <Text size={19} weight="regular">
              {data.description}
            </Text>
            <div style={{ display: 'flex' }}>
              <GroupIcon color="$neutral-50" />
              <Text size={15} weight="regular">
                {data.membersCount}
              </Text>
            </div>
            {/* todo: tags */}
          </div>

          <div
            style={{
              border: '1px solid #F0F2F5',
              borderRadius: 16,
              padding: '12px 16px',
            }}
          >
            <Text size={19} weight="semibold">
              How to join this community:
            </Text>
            <ol>
              <li>
                <div>
                  <Button size={24}>Download</Button>
                  <Text size={13} weight="regular">
                    the Status app
                  </Text>
                </div>
              </li>
              <li>
                <Text size={13} weight="regular">
                  Install Status
                </Text>
              </li>
              <li>
                <Text size={13} weight="regular">
                  Complete the onboarding
                </Text>
              </li>
              <li>
                <div>
                  <Button size={24}>Join community in Status</Button>
                  <div>
                    <Text size={13} weight="regular">
                      and voilá
                    </Text>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          <div
            style={{
              border: '1px solid #F0F2F5',
              borderRadius: 16,
              padding: '12px 16px',
            }}
          >
            <Text size={15} weight="semibold">
              Have Status on your phone?
            </Text>
            <Text size={13} weight="regular">
              Scan the QR code with your device
            </Text>
            {/* todo: QR dialog */}
            {/* <Button type="grey" size={32}>
              Show QR code
            </Button> */}
          </div>

          <div>
            <Text>Powered by</Text>
            {/* todo: Status logo */}
          </div>
        </div>
      )}
    </PreviewPage>
  )
}
