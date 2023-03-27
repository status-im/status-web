import {
  decodeCommunityURLData,
  deserializePublicKey,
  verifyEncodedURLData,
  indicesToTags,
} from '@status-im/js'
import { createGetServerSideProps, ServerSideProps } from '@/server/ssr'
import { Client, useWaku } from '@/hooks/use-waku'
import { useState, useEffect } from 'react'
import { PreviewPage } from '@/components/page'
import { ERROR_CODES } from '@/consts/error-codes'
import {
  Avatar,
  Paragraph,
  Button,
  Heading,
  Label,
} from '@status-im/components'

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
  const client = useWaku(publicKey, async client => {
    const data = await client.fetchCommunity(publicKey)

    if (!data) {
      return
    }

    setData(data)
  })

  const handleRetry = async () => {
    const data = await client.fetchCommunity(publicKey)

    if (!data) {
      return
    }

    setData(data)
  }

  // todo?: pass meta, info as component
  // todo?: pass image, color as props
  return (
    <PreviewPage
      errorCode={error || props.errorCode}
      unverifiedData={props.unverifiedData}
      onRetry={handleRetry}
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
          <Avatar
            src="https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80"
            size={80}
          />
          <Heading>{data.displayName}</Heading>
          <Paragraph>{data.description}</Paragraph>
          <div>
            {/* todo: icons */}
            <Label>{data.membersCount}</Label>
          </div>
          {/* todo: tags */}

          <div>
            <Heading heading="h2">How to join this community:</Heading>
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
                  <Button size={24}>Join community in Status</Button>
                  <div>
                    <Paragraph>and voilá</Paragraph>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          <div>
            <Heading heading="h2">Have Status on your phone?</Heading>
            <Paragraph>Scan the QR code with your device</Paragraph>
            {/* todo: QR dialog */}
            <Button type="grey" size={32}>
              Show QR code
            </Button>
          </div>

          <div>
            <Paragraph>Powered by</Paragraph>
            {/* todo: Status logo */}
          </div>
        </div>
      )}
    </PreviewPage>
  )
}
