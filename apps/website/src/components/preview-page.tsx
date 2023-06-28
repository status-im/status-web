// todo?: rename to preview/onboarding/sharing/conversion-page/screen/invite.tsx

import { useMemo } from 'react'

import { neutral } from '@status-im/colors'
import {
  Avatar,
  Button,
  ContextTag,
  Counter,
  Skeleton,
  Tag,
  Text,
  ToastContainer,
  useToast,
} from '@status-im/components'
import {
  DownloadIcon,
  InfoIcon,
  MembersIcon,
  QrCodeIcon,
} from '@status-im/icons'
import { useQuery } from '@tanstack/react-query'
import Head from 'next/head'
import { useRouter } from 'next/router'

import { ERROR_CODES } from '@/consts/error-codes'
import { useURLData } from '@/hooks/use-url-data'
import { getRequestClient } from '@/lib/request-client'

import { ErrorPage } from './error-page'
import { QrDialog } from './qr-dialog'

import type { ChannelInfo, CommunityInfo, UserInfo } from '@status-im/js'
import type {
  decodeChannelURLData,
  decodeCommunityURLData,
  decodeUserURLData,
} from '@status-im/js/encode-url-data'
import type { CSSProperties } from 'react'

type Type = 'community' | 'channel' | 'profile'

type PreviewPageProps = {
  type: Type
  encodedData?: string | null
  index?: boolean
} & (
  | {
      type: 'community'
      decodedData?: ReturnType<typeof decodeCommunityURLData> | null
    }
  | {
      type: 'channel'
      decodedData?: ReturnType<typeof decodeChannelURLData> | null
      channelUuid?: string
    }
  | {
      type: 'profile'
      decodedData?: ReturnType<typeof decodeUserURLData> | null
    }
)

export type Data =
  | {
      type: 'community'
      info: CommunityInfo
    }
  | {
      type: 'channel'
      info:
        | ChannelInfo
        // if from url
        | (Omit<ChannelInfo, 'community'> & {
            community: Pick<ChannelInfo['community'], 'displayName'>
          })
    }
  | {
      type: 'profile'
      info: UserInfo
    }

const ACTION_VERB: Record<Type, string> = {
  community: 'Join',
  channel: 'View',
  profile: 'Open',
}

const INSTRUCTIONS_HEADING: Record<Type, string> = {
  community: 'How to join this community:',
  channel: 'How to join this channel:',
  profile: 'How to connect with this profile:',
}

const JOIN_BUTTON_LABEL: Record<Type, string> = {
  community: 'Join community in Status',
  channel: 'View channel in Status',
  profile: 'Open profile in Status',
}

export function PreviewPage(props: PreviewPageProps) {
  const { type, decodedData, encodedData, index } = props

  const { asPath } = useRouter()

  const toast = useToast()

  // todo: default og image, not dynamic
  // const ogImageUrl = getOgImageUrl(props.decodedData)
  // todo?: pass meta, info as component
  // todo?: pass image, color as props

  const {
    publicKey,
    channelUuid: urlChannelUuid,
    data: urlData,
    errorCode: urlErrorCode,
    isLoading: urlIsLoading,
  } = useURLData(type, decodedData, encodedData)

  const wakuQueryIsEnabled = Boolean(publicKey)
  const {
    data: wakuData,
    isLoading,
    status,
    refetch,
  } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: [type],
    enabled: wakuQueryIsEnabled,
    queryFn: async function ({ queryKey }): Promise<Data | null> {
      const client = await getRequestClient()

      switch (queryKey[0]) {
        case 'community': {
          const info = await client.fetchCommunity(publicKey!)

          if (!info) {
            return null
          }

          return { type: 'community', info }
        }
        case 'channel': {
          const channelUuid =
            'channelUuid' in props && props.channelUuid
              ? props.channelUuid
              : urlChannelUuid

          if (!channelUuid) {
            return null
          }

          const info = await client.fetchChannel(publicKey!, channelUuid)

          if (!info) {
            return null
          }

          return { type: 'channel', info }
        }
        case 'profile': {
          const info = await client.fetchUser(publicKey!)

          if (!info) {
            return null
          }

          return { type: 'profile', info }
        }
      }
    },
    onSettled: (data, error) => {
      if (!data || error) {
        // todo?: rephrase to "fetch latest"
        toast.negative("Couldn't fetch information", {
          action: 'Retry',
          onAction: refetch,
        })

        return
      }

      if (urlData) {
        toast.custom('Information just updated', <InfoIcon size={20} />)
      }
    },
  })

  const loading = getLoading()

  function getLoading(): boolean {
    if (urlIsLoading) {
      return true
    }

    if (wakuQueryIsEnabled) {
      return status === 'loading' || isLoading
    }

    return false
  }

  const data: Data | undefined = wakuData ?? urlData

  const { avatarURL, bannerURL } = useMemo(() => {
    if (!data) {
      return {}
    }

    const avatarURL = getAvatarURL(data)
    const bannerURL = getBannerURL(data)

    return { avatarURL, bannerURL }
  }, [data])

  if (urlErrorCode) {
    return <ErrorPage errorCode={urlErrorCode} />
  }

  if (!loading && !data) {
    return <ErrorPage errorCode={ERROR_CODES.NOT_FOUND} />
  }

  // const urlOrigin = process.env.VERCEL_URL
  //   ? 'https://' + process.env.VERCEL_URL
  //   : ''

  if ((loading && !data) || !data || !publicKey) {
    return (
      <>
        <Head>
          <meta property="og:url" content={`https://status.app${asPath}`} />
          {/* todo: test if server-rendered version with which a (social) card would be
        generated would not effectively override actual shared link on clicking */}
          {/* <meta
            property="og:image"
            content={`${urlOrigin}/assets/preview/entity.png`}
            key="og:image"
          /> */}
          <meta
            property="al:ios:url"
            content={`https://status.app${asPath}`}
            key="al:ios:url"
          />
          <meta
            property="al:android:url"
            content={`https://status.app${asPath}`}
            key="al:android:url"
          />
          {!index && <meta name="robots" content="noindex" />}
        </Head>
        <div className="h-full xl:grid xl:grid-cols-[560px,auto]">
          <div className="pb-10">
            <div className="mx-auto px-5 pt-20 xl:px-20">
              <div className="mb-8 xl:mb-10">
                {/* avatar */}
                <div className="mb-2 xl:mb-4">
                  <Skeleton
                    height={80}
                    width={80}
                    borderRadius="$full"
                    borderWidth={2}
                    borderColor="$white-100"
                    variant="secondary"
                  />
                </div>
                {/* display name */}
                <Skeleton
                  height={48}
                  width={240}
                  borderRadius="$12"
                  mb={14}
                  variant="secondary"
                />
                {/* description */}
                <Skeleton
                  height={24}
                  width={400}
                  borderRadius="$8"
                  mb={8}
                  variant="secondary"
                />
                {/* description */}
                <Skeleton
                  height={24}
                  width={302}
                  borderRadius="$8"
                  mb={8}
                  variant="secondary"
                />
              </div>

              <div className="mb-6 grid gap-3">
                {/* instructions */}
                <Skeleton
                  height={184}
                  width={400}
                  borderRadius="$16"
                  mb={14}
                  variant="secondary"
                />
                {/* instructions */}
                <Skeleton
                  height={118}
                  width={400}
                  borderRadius="$16"
                  mb={14}
                  variant="secondary"
                />
              </div>

              <div className="flex items-center gap-1">
                <Skeleton
                  height={16}
                  width={70}
                  borderRadius="$6"
                  borderWidth={2}
                  borderColor="$white-100"
                  variant="secondary"
                />
                {/* logo */}
                <Skeleton
                  height={24}
                  width={24}
                  borderRadius="$full"
                  borderWidth={2}
                  borderColor="$white-100"
                  variant="secondary"
                />
                <Skeleton
                  height={16}
                  width={70}
                  borderRadius="$6"
                  borderWidth={2}
                  borderColor="$white-100"
                  variant="secondary"
                />
              </div>
            </div>
          </div>
          <div className="hidden h-full max-h-[944px] p-2 xl:block">
            {/* banner */}
            <Skeleton
              height="100%"
              width="100%"
              borderRadius="$20"
              borderWidth={2}
              borderColor="$white-100"
              variant="secondary"
            />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>
          {`${ACTION_VERB[type]} ${data.info.displayName} in Status`}
        </title>

        <meta property="og:url" content={`https://status.app${asPath}`} />
        <meta
          property="og:title"
          content={`${ACTION_VERB[type]} ${data.info.displayName} in Status`}
        />
        {/* <meta
          property="og:image"
          content={`${urlOrigin}/assets/preview/entity.png`}
          key="og:image"
        /> */}
        <meta property="og:description" content={data.info.description} />
        <meta
          name="apple-itunes-app"
          content={`app-id=1178893006, app-argument=status-app://${asPath.replace(
            /\//,
            ''
          )}`}
        />
        {!index && <meta name="robots" content="noindex" />}
      </Head>
      <>
        {/* todo: theme; based on user system settings */}
        <div
          style={!bannerURL ? getGradientStyles(data) : undefined}
          className="relative h-full bg-gradient-to-b from-[var(--gradient-color)] to-[#fff] to-20% xl:grid xl:grid-cols-[560px,auto]"
        >
          <div className="absolute inset-x-0 top-0 xl:hidden">
            <div className="absolute h-full w-full bg-gradient-to-t from-white-100 to-white-60" />
            {bannerURL && (
              <img
                className="aspect-video h-full w-full object-cover"
                src={bannerURL}
                alt=""
              />
            )}
          </div>

          <div className="relative z-20 pb-10">
            <div className="mx-auto px-5 pt-20 xl:px-20">
              {/* HERO */}
              <div className="mb-[32px] xl:mb-[35px]">
                <div className="mb-2 xl:mb-4">
                  {data.type === 'community' && (
                    <Avatar
                      type="community"
                      name={data.info.displayName}
                      src={avatarURL}
                      size={80}
                    />
                  )}
                  {data.type === 'channel' && (
                    <Avatar
                      type="channel"
                      name={data.info.displayName}
                      emoji={data.info.emoji}
                      size={80}
                      // fixme: use `data.info.color` (e.g. #000000 format)
                      backgroundColor="$neutral-100"
                    />
                  )}
                  {data.type === 'profile' && (
                    <Avatar
                      type="user"
                      name={data.info.displayName}
                      src={avatarURL}
                      size={80}
                      colorHash={data.info.colorHash}
                    />
                  )}
                </div>

                <h1 className="mb-3 text-40 xl:text-64">
                  {data.type === 'channel' && '#'}
                  {data.info.displayName}
                </h1>
                <p className="mb-4 text-[15px] text-neutral-100 xl:text-[19px]">
                  {data.info.description}
                </p>

                {data.type === 'community' && (
                  <>
                    <div className="mb-4 flex items-center gap-1">
                      <MembersIcon size={20} color="$neutral-50" />
                      <Text size={15}>
                        {formatNumber(data.info.membersCount)}
                      </Text>
                    </div>
                    {data.info.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-[6px] xl:gap-[11px]">
                        {data.info.tags.map(tag => (
                          <Tag
                            key={tag.emoji + tag.text}
                            size={32}
                            icon={tag.emoji}
                            label={tag.text}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
                {data.type === 'channel' && (
                  <div className="flex items-center gap-1">
                    <Text size={13} color="$neutral-40">
                      Channel in
                    </Text>
                    <ContextTag
                      type="community"
                      community={{
                        name: data.info.community.displayName,
                        src: getAvatarURL({
                          type: 'community',
                          info: data.info.community as CommunityInfo,
                        }),
                      }}
                    />
                  </div>
                )}
                {data.type === 'profile' && (
                  <p className="text-[16px] tracking-[.2em]">
                    {data.info.emojiHash}
                  </p>
                )}
              </div>

              {/* INSTRUCTIONS */}
              <div className="mb-6 grid gap-3">
                <div className="rounded-2xl border border-neutral-10 bg-white-100 px-4 py-3">
                  <h3 className="mb-2 text-[15px] font-semibold xl:text-[19px]">
                    {INSTRUCTIONS_HEADING[type]}
                  </h3>
                  <ul>
                    <ListItem order={1}>
                      <Button
                        size={24}
                        icon={<DownloadIcon size={12} />}
                        disabled
                      >
                        Sign up for early access
                      </Button>
                    </ListItem>
                    {/* todo?: delete step; merge with download */}
                    <ListItem order={2}>
                      <Text size={13}>Install Status</Text>
                    </ListItem>
                    <ListItem order={3}>
                      <Text size={13}>Complete the onboarding</Text>
                    </ListItem>
                    <ListItem order={4}>
                      <Button
                        size={24}
                        variant="grey"
                        onPress={() => {
                          window.open(
                            `status-app://${asPath.replace(/\//, '')}`,
                            '_self',
                            'noopener'
                          )
                        }}
                      >
                        {JOIN_BUTTON_LABEL[type]}
                      </Button>
                      <Text size={13}>and voilá</Text>
                    </ListItem>
                  </ul>
                </div>

                <div className="flex flex-col items-start gap-4 rounded-2xl border border-neutral-10 bg-white-100 p-4 pt-3">
                  <div className="flex flex-col gap-1">
                    <Text size={15} weight="semibold">
                      Have Status already?
                    </Text>
                    <Text size={13}>Scan the QR code with your device</Text>
                  </div>

                  <QrDialog value={publicKey}>
                    <Button
                      variant="grey"
                      size={32}
                      icon={<QrCodeIcon size={20} color="$neutral-50" />}
                    >
                      Show QR code
                    </Button>
                  </QrDialog>
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex items-center gap-1">
                <Text size={13} color="$neutral-50">
                  Powered by
                </Text>
                <StatusLogo />
              </div>
            </div>
          </div>

          <div className="hidden p-2 xl:block">
            <div
              style={
                !bannerURL
                  ? {
                      backgroundColor:
                        'color' in data.info ? data.info.color : neutral[100],
                    }
                  : undefined
              }
              className="h-full max-h-[944px] w-full rounded-[20px]"
            >
              {bannerURL && (
                <img
                  className="h-full max-h-[944px] w-full rounded-[20px] object-cover object-center"
                  src={bannerURL}
                  alt=""
                />
              )}
            </div>
          </div>
        </div>

        <ToastContainer />
      </>
    </>
  )
}

const formatNumber = (n: number) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(n)
}

const getGradientStyles = (data: Data): CSSProperties => {
  return {
    // @ts-expect-error CSSProperties do not handle inline CSS variables
    '--gradient-color': 'color' in data.info ? data.info.color : neutral[100],
  }
}

const getAvatarURL = (data: Data): string | undefined => {
  let avatar: Uint8Array | undefined
  switch (data.type) {
    case 'community':
      avatar = data.info.photo

      break
    case 'profile':
      avatar = data.info.photo

      break
  }

  if (!avatar) {
    return
  }

  const url = URL.createObjectURL(
    new Blob([avatar], {
      type: 'image/jpeg',
    })
  )

  return url
}

const getBannerURL = (data: Data): string | undefined => {
  let banner: Uint8Array | undefined
  switch (data.type) {
    case 'community':
      banner = data.info.banner

      break
    case 'channel':
      banner =
        'banner' in data.info.community ? data.info.community.banner : undefined

      break
  }

  if (!banner) {
    return
  }

  const url = URL.createObjectURL(
    new Blob([banner], {
      type: 'image/jpeg',
    })
  )

  return url
}

type ListItemProps = {
  order: number
  children: React.ReactNode
}

const ListItem = (props: ListItemProps) => {
  const { order, children } = props

  return (
    <li className="flex items-center gap-2 py-1">
      <Counter type="outline" value={order} />
      {children}
    </li>
  )
}

const StatusLogo = () => (
  <svg
    width="80"
    height="24"
    viewBox="0 0 80 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="12" cy="12" rx="12" ry="12" fill="white" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.0241 11.8892C12.5858 11.972 11.6845 11.637 10.246 11.7201C9.88926 11.7401 9.53497 11.7918 9.18731 11.8746C9.39963 9.21449 11.2823 6.88748 13.8423 6.73957C15.4133 6.64892 16.9836 7.61889 17.0688 9.19353C17.1526 10.7412 15.9725 11.7766 14.0243 11.889L14.0241 11.8892ZM10.1618 17.3303C8.6568 17.4153 7.15274 16.5073 7.07106 15.0338C6.99074 13.5853 8.12144 12.6163 9.98782 12.5111C11.3655 12.4335 12.2291 12.7471 13.6068 12.6693C13.9484 12.6506 14.2877 12.6022 14.621 12.5247C14.4179 15.0142 12.6145 17.1921 10.1618 17.3303ZM11.9999 0.000194109C5.37249 -2.50833e-09 0 5.37244 0 12C0 18.6276 5.37249 24 11.9999 24C18.6274 24 23.9999 18.6274 23.9999 12C23.9999 5.37263 18.6274 0 11.9999 0"
      fill="#2A4AF5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M30 14.4811H32.6649C32.6649 14.8812 32.7922 15.1684 33.0467 15.3426C33.3016 15.5169 33.6285 15.6041 34.0278 15.6041C34.3578 15.6041 34.6281 15.5471 34.8396 15.4325C35.0507 15.3178 35.1563 15.13 35.1563 14.8685C35.1563 14.7141 35.1113 14.5874 35.0217 14.4889C34.9319 14.3904 34.7945 14.3022 34.6092 14.225C34.3763 14.1304 34.1399 14.0451 33.9005 13.9693L32.8558 13.6294C32.5091 13.5153 32.1661 13.3901 31.8272 13.2538C31.5062 13.1242 31.224 12.9623 30.981 12.769C30.7416 12.5806 30.5471 12.339 30.4122 12.0625C30.2762 11.7848 30.2084 11.4406 30.2084 11.0302C30.2084 10.559 30.2982 10.1517 30.4773 9.80721C30.6561 9.46368 30.9158 9.17108 31.2328 8.95579C31.5566 8.73227 31.9446 8.56464 32.3957 8.45317C32.8474 8.34141 33.3449 8.28554 33.8889 8.28554C34.5546 8.28554 35.1273 8.36388 35.6077 8.52086C36.0878 8.67812 36.4815 8.89242 36.7884 9.16403C37.0947 9.43594 37.322 9.75594 37.4698 10.1243C37.6174 10.4927 37.6911 10.8882 37.6911 11.311H35.0088C35.0088 10.9423 34.9176 10.6558 34.7351 10.4504C34.5529 10.245 34.2767 10.1422 33.9064 10.1422C33.6228 10.1422 33.3798 10.2073 33.1771 10.3372C32.9744 10.4668 32.8733 10.6618 32.8733 10.9213C32.8733 11.0956 32.9211 11.2353 33.0169 11.3401C33.1126 11.445 33.2531 11.5397 33.4384 11.6235C33.6242 11.7076 33.8529 11.7949 34.1255 11.8848L35.062 12.1947C35.4436 12.2972 35.7995 12.4107 36.1292 12.536C36.4587 12.6613 36.7495 12.8137 37.001 12.9928C37.2487 13.1673 37.4537 13.398 37.5999 13.6668C37.7475 13.937 37.8212 14.2801 37.8212 14.6951C37.8212 15.2432 37.717 15.7099 37.5087 16.0952C37.307 16.4729 37.0197 16.7956 36.671 17.0362C36.321 17.2782 35.9144 17.4519 35.4514 17.557C34.9885 17.6621 34.5025 17.7146 33.9931 17.7146C32.726 17.7146 31.7433 17.4383 31.0461 16.8859C30.3486 16.3334 30 15.5319 30 14.4811ZM38.1006 10.7543V8.64846H39.424V6H42.1142V8.64846H44.0394V10.7545H42.1142V13.9272C42.1142 14.2567 42.143 14.5188 42.2001 14.7136C42.2573 14.9083 42.3389 15.0612 42.4451 15.1718C42.5498 15.2821 42.6847 15.3573 42.832 15.3875C43.0003 15.4222 43.1717 15.4387 43.3433 15.4368C43.4577 15.4368 43.6041 15.4325 43.7818 15.4233C43.9592 15.4146 44.114 15.3979 44.2458 15.3737V17.5685C43.9964 17.6116 43.7455 17.6451 43.4937 17.6691C43.193 17.6996 42.839 17.7148 42.4321 17.7148C42.0979 17.7134 41.7642 17.6894 41.4331 17.6428C41.0839 17.595 40.7504 17.4648 40.4588 17.2626C40.1598 17.0581 39.9125 16.743 39.7174 16.3185C39.5217 15.8936 39.424 15.3104 39.424 14.5692V10.7543H38.1006ZM47.5964 13.2812C47.5964 13.5902 47.6485 13.8857 47.7524 14.1677C47.856 14.4494 47.9987 14.6919 48.1795 14.895C48.3642 15.1008 48.5864 15.2676 48.8336 15.3861C49.0887 15.5105 49.3737 15.5725 49.6882 15.5725C50.0025 15.5725 50.2891 15.5105 50.5471 15.3861C50.8056 15.2617 51.0249 15.0981 51.206 14.895C51.387 14.6922 51.5292 14.4514 51.6331 14.1721C51.7381 13.8874 51.791 13.5854 51.7891 13.2812C51.791 12.9828 51.7381 12.6868 51.6331 12.4084C51.5333 12.1423 51.3887 11.8961 51.206 11.6809C51.0249 11.4688 50.802 11.2983 50.5518 11.1808C50.2965 11.0599 50.0084 10.9991 49.6882 10.9991C49.3737 10.9991 49.0887 11.0596 48.8336 11.1805C48.5835 11.2982 48.3605 11.4687 48.1795 11.6809C47.9968 11.8961 47.8522 12.1423 47.7524 12.4084C47.6474 12.6868 47.5945 12.9828 47.5964 13.2812ZM44.8045 13.2812C44.8045 12.6083 44.9103 11.9839 45.1224 11.4081C45.3341 10.832 45.6292 10.3366 46.0085 9.92156C46.3852 9.50807 46.8365 9.17307 47.3376 8.93505C47.845 8.69252 48.3941 8.57126 48.9851 8.57126C49.6437 8.57126 50.2151 8.71384 50.6985 8.99842C51.1823 9.28357 51.5458 9.64418 51.7891 10.0806V8.79852H54.581V17.773H51.7891V16.5089C51.5695 16.9207 51.2161 17.2724 50.7298 17.5633C50.2432 17.8543 49.6615 18 48.9851 18C48.4003 18 47.8526 17.8787 47.3424 17.6362C46.8385 17.3986 46.3853 17.0618 46.0085 16.6451C45.6295 16.2269 45.3341 15.73 45.1224 15.154C44.9103 14.5782 44.8045 13.954 44.8045 13.2812ZM55.3232 10.754V8.64846H56.6466V6H59.3369V8.64846H61.262V10.7545H59.3369V13.9272C59.3369 14.2567 59.3656 14.5188 59.4228 14.7136C59.4799 14.9083 59.5616 15.0612 59.6677 15.1718C59.7724 15.2821 59.9073 15.3573 60.0546 15.3875C60.2229 15.4222 60.3943 15.4387 60.566 15.4368C60.6803 15.4368 60.8267 15.4325 61.0044 15.4233C61.1818 15.4146 61.3367 15.3979 61.4685 15.3737V17.5685C61.2191 17.6116 60.9682 17.6451 60.7163 17.6691C60.4156 17.6996 60.0617 17.7148 59.6548 17.7148C59.3206 17.7134 58.9868 17.6894 58.6557 17.6428C58.3066 17.595 57.973 17.4648 57.6814 17.2626C57.3824 17.0581 57.1352 16.743 56.94 16.3185C56.7443 15.8936 56.6466 15.3104 56.6466 14.5692V10.7543L55.3232 10.754ZM62.4022 14.0999V8.80591H65.1401V13.3776C65.1401 14.0161 65.2504 14.5354 65.4715 14.9361C65.6922 15.3365 66.0876 15.5369 66.6575 15.5369C67.2274 15.5369 67.6478 15.3336 67.9182 14.9269C68.1885 14.5205 68.3236 13.9709 68.3236 13.2782V8.80591H71.0615V17.7234H68.3236V16.4494C68.0854 16.9192 67.7219 17.2867 67.2333 17.5517C66.7451 17.8167 66.1605 17.9492 65.4802 17.9492C64.8821 17.9492 64.3913 17.8527 64.0073 17.66C63.6232 17.4673 63.3109 17.2237 63.0704 16.9284C62.795 16.5848 62.6148 16.1873 62.5298 15.736C62.4448 15.2838 62.4022 14.7385 62.4022 14.0999ZM72.1788 14.4811H74.8437C74.8437 14.8812 74.9709 15.1684 75.2255 15.3426C75.48 15.5169 75.8072 15.6041 76.2065 15.6041C76.5365 15.6041 76.8069 15.5471 77.018 15.4325C77.2292 15.3178 77.3351 15.13 77.3351 14.8685C77.3351 14.7141 77.2901 14.5874 77.2005 14.4889C77.1107 14.3904 76.9733 14.3022 76.788 14.225C76.5551 14.1304 76.3186 14.0451 76.0793 13.9693L75.0346 13.6294C74.6879 13.5153 74.3449 13.39 74.006 13.2538C73.685 13.1242 73.4025 12.9623 73.1598 12.769C72.9203 12.5806 72.7259 12.339 72.591 12.0625C72.455 11.7848 72.3871 11.4406 72.3871 11.0302C72.3871 10.559 72.4767 10.1517 72.6561 9.80721C72.8349 9.46368 73.0946 9.17108 73.4115 8.95579C73.7354 8.73227 74.1234 8.56464 74.5745 8.45317C75.0258 8.34141 75.5234 8.28554 76.0677 8.28554C76.7331 8.28554 77.3061 8.36388 77.7865 8.52086C78.2666 8.67812 78.6602 8.89242 78.9672 9.16403C79.2735 9.43594 79.5008 9.75594 79.6486 10.1243C79.7959 10.4927 79.8699 10.8882 79.8699 11.311H77.1876C77.1876 10.9423 77.0963 10.6558 76.9139 10.4504C76.7317 10.245 76.4552 10.1422 76.0849 10.1422C75.8013 10.1422 75.5583 10.2073 75.3556 10.3372C75.1531 10.4668 75.052 10.6618 75.052 10.9213C75.052 11.0956 75.0999 11.2353 75.1956 11.3401C75.2914 11.445 75.4316 11.5397 75.6172 11.6235C75.803 11.7076 76.0314 11.7949 76.3039 11.8848L77.2408 12.1947C77.6018 12.2905 77.9579 12.4044 78.308 12.536C78.6374 12.6613 78.9283 12.8137 79.1798 12.9928C79.4274 13.1674 79.6324 13.398 79.7787 13.6668C79.9262 13.937 80 14.2801 80 14.6951C80 15.2432 79.8958 15.7099 79.6874 16.0952C79.4858 16.473 79.1986 16.7957 78.8497 17.0362C78.4997 17.2782 78.0931 17.4519 77.6302 17.557C77.167 17.6621 76.6813 17.7146 76.1719 17.7146C74.9048 17.7146 73.922 17.4383 73.2248 16.8859C72.5274 16.3334 72.1788 15.5319 72.1788 14.4811Z"
      fill="#09101C"
    />
  </svg>
)
