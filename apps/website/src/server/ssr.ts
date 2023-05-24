import { ERROR_CODES } from '@/consts/error-codes'

import type {
  decodeChannelURLData,
  decodeCommunityURLData,
  decodeUserURLData,
} from '@status-im/js/encode-url-data'
import type { GetServerSideProps } from 'next'
import type { ParsedUrlQuery } from 'querystring'

type DecodeType =
  | typeof decodeCommunityURLData
  | typeof decodeChannelURLData
  | typeof decodeUserURLData

export type ServerSideProps<T = ReturnType<DecodeType>> = {
  /**
   * For verifying on client without decoding or re-encoding.
   *
   * Verification in general is done on encoded data, so it is not
   * decoded, decompressed and deserialized unnecessarily if not to be
   * displayed or othwerwise needed.
   */
  uverifiedEncodedData: string | null
  /**
   * For instaneous preview even if the data is not verified yet.
   */
  unverifiedDecodedData: T | null
  serverErrorCode?: number
  channelUuid?: string
}

type Query = ParsedUrlQuery & {
  slug: string
}

export function createGetServerSideProps(decodeURLData: DecodeType) {
  const getServerSideProps: GetServerSideProps<
    ServerSideProps,
    Query
  > = async context => {
    try {
      const { params, res } = context

      const channelUuid = params!.slug.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )

      if (channelUuid) {
        const props: ServerSideProps = {
          channelUuid: channelUuid[0],
          uverifiedEncodedData: null,
          unverifiedDecodedData: null,
        }

        return { props }
      }

      const encodedData = params!.slug

      if (!encodedData) {
        const props: ServerSideProps = {
          uverifiedEncodedData: null,
          unverifiedDecodedData: null,
        }

        return { props }
      }

      const decodedData = decodeURLData(encodedData)
      const props: ServerSideProps = {
        uverifiedEncodedData: encodedData,
        unverifiedDecodedData: decodedData || null,
      }

      // fixme: set Cache-Control
      res.setHeader(
        'Cache-Control',
        'public, max-age=0, s-maxage=180, stale-while-revalidate=239'
        // 'public, max-age=0, s-maxage=1, stale-while-revalidate=900',
        // 'public, max-age=0, s-maxage=600, stale-while-revalidate=900',
        // 'public, s-maxage=10, stale-while-revalidate=59',
        // 'public, max-age=31536000, immutable',
      )

      return { props }
    } catch (error) {
      console.error(error)

      const props: ServerSideProps = {
        serverErrorCode: ERROR_CODES.INTERNAL_SERVER_ERROR,
        uverifiedEncodedData: null,
        unverifiedDecodedData: null,
      }

      return { props }
    }
  }

  return getServerSideProps
}
