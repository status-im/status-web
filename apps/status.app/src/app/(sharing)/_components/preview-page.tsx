// todo?: rename to preview/onboarding/sharing/conversion-page/screen/invite.tsx
'use client'

import { useEffect, useMemo } from 'react'

import { neutral, white } from '@status-im/colors'
import {
  Avatar,
  Button,
  ContextTag,
  Counter,
  Skeleton,
  Tag,
  useToast,
} from '@status-im/components'
import { DownloadIcon } from '@status-im/icons/12'
import { ExternalIcon } from '@status-im/icons/16'
import { InfoIcon, MembersIcon, QrCodeIcon } from '@status-im/icons/20'
import {
  type ChannelInfo,
  type CommunityInfo,
  type UserInfo,
} from '@status-im/js'
import { useQuery } from '@tanstack/react-query'
import { cx } from 'class-variance-authority'

import { LEARN_MORE_MOBILE_APP_URL } from '~/config/routes'
import { Image } from '~components/assets'
import { ERROR_CODES } from '~sharing/_error-codes'
import { useURLData } from '~sharing/_hooks/use-url-data'
import { getRequestClient } from '~sharing/_lib/request-client'
import { DownloadDesktopButton } from '~website/_components/download-desktop-button'
import { DownloadMobileButton } from '~website/_components/download-mobile-button'

import { ErrorPage } from './error-page'
import { QrDialog } from './qr-dialog'

import type {
  decodeChannelURLData,
  decodeCommunityURLData,
  decodeUserURLData,
} from '@status-im/js/encode-url-data'

type Type = 'community' | 'channel' | 'profile'

type DecodedCommunityData = ReturnType<typeof decodeCommunityURLData> | null

type DecodedChannelData = ReturnType<typeof decodeChannelURLData> | null

type DecodedProfileData = ReturnType<typeof decodeUserURLData> | null

type PreviewPageProps = {
  type: Type
  encodedData?: string | null
  index?: boolean
} & (
  | {
      type: 'community'
      decodedData?: DecodedCommunityData
    }
  | {
      type: 'channel'
      decodedData?: DecodedChannelData
      channelUuid?: string
    }
  | {
      type: 'profile'
      decodedData?: DecodedProfileData
    }
)

type CommunityData = {
  type: 'community'
  info: CommunityInfo
}

type ChannelData = {
  type: 'channel'
  info:
    | ChannelInfo
    // if from url
    | (Omit<ChannelInfo, 'community'> & {
        community: Pick<ChannelInfo['community'], 'displayName'>
      })
}

type ProfileData = {
  type: 'profile'
  info: UserInfo
}

export type Data = CommunityData | ChannelData | ProfileData

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
  const { type, decodedData, encodedData } = props

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
    url,
  } = useURLData(type, decodedData, encodedData)

  const wakuQueryIsEnabled = Boolean(publicKey)
  const {
    data: wakuData,
    isLoading,
    status,
    isFetching,
    error,
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
  })

  function getLoading(): boolean {
    const settled = status === 'success' || status === 'error'
    if (!settled) {
      return true
    }

    if (urlIsLoading) {
      return true
    }

    if (isFetching) {
      return true
    }

    if (isLoading) {
      return status === 'pending' || isLoading
    }

    return false
  }

  const loading = getLoading()

  useEffect(() => {
    if (loading) {
      return
    }

    const stopClient = async () => {
      const client = await getRequestClient()
      client.stop()
    }

    stopClient()

    if (!wakuData || error) {
      // todo?: rephrase to "fetch latest"
      toast.negative("Couldn't fetch information")

      return
    }

    if (urlData) {
      toast.custom('Information just updated', <InfoIcon />)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const data: Data | undefined = wakuData ?? urlData

  const { avatarURL } = useMemo(() => {
    if (!data) {
      return {}
    }

    const avatarURL = getAvatarURL(data)

    return { avatarURL }
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

  const joinHandler = () => {
    const pathname = window.location.pathname.replace(/\//, '')
    const hash = window.location.hash

    window.open(`status-app://${pathname}${hash}`, '_self', 'noopener')
  }

  if ((loading && !data) || !data || !publicKey) {
    return (
      <div className="size-full min-h-screen bg-white-100">
        <div className="m-auto h-full min-h-screen max-w-[1512px] xl:grid xl:grid-cols-[560px,auto]">
          <div className="pb-10">
            <div className="mx-auto px-5 pt-20 xl:px-20">
              <div className="mb-8 xl:mb-10">
                {/* avatar */}
                <div className="mb-2 xl:mb-4">
                  <Skeleton
                    height={80}
                    width={80}
                    variant="secondary"
                    className="rounded-full border-2 border-white-100"
                  />
                </div>
                {/* display name */}
                <Skeleton
                  height={48}
                  width={240}
                  className="mb-14 rounded-12"
                  variant="secondary"
                />
                {/* description */}
                <Skeleton
                  height={24}
                  width={400}
                  className="mb-8 rounded-8"
                  variant="secondary"
                />
                {/* description */}
                <Skeleton
                  height={24}
                  width={302}
                  className="mb-8 rounded-8"
                  variant="secondary"
                />
              </div>

              <div className="mb-6 grid gap-3">
                {/* instructions */}
                <Skeleton
                  height={184}
                  width={400}
                  className="mb-14 rounded-16"
                  variant="secondary"
                />
                {/* instructions */}
                <Skeleton
                  height={118}
                  width={400}
                  className="mb-14 rounded-16"
                  variant="secondary"
                />
              </div>

              <div className="flex items-center gap-1">
                <Skeleton
                  height={16}
                  width={70}
                  className="rounded-6 border-2 border-white-100"
                  variant="secondary"
                />
                {/* logo */}
                <Skeleton
                  height={24}
                  width={24}
                  className="rounded-full border-2 border-white-100"
                  variant="secondary"
                />
                <Skeleton
                  height={16}
                  width={70}
                  className="rounded-6 border-2 border-white-100"
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
              className="rounded-20 border-2 border-white-100"
              variant="secondary"
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* todo: theme; based on user system settings */}
      <div
        style={
          {
            '--gradient-accent-color':
              'color' in data.info
                ? data.info.color // await desktop support
                : white[100], // no gradient
            '--gradient-current-accent-color': 'var(--gradient-accent-color)',
          } as React.CSSProperties
        }
        className="relative size-full min-h-screen bg-white-100 bg-gradient-to-b from-[var(--gradient-current-accent-color)] to-white-100 to-20% xl:from-[var(--gradient-accent-color)]"
      >
        <div className="m-auto h-full min-h-screen max-w-[1512px] xl:grid xl:grid-cols-[560px,auto]">
          <div className="relative z-20 pb-10">
            <div className="mx-auto px-5 pt-20 xl:px-20">
              {/* HERO */}
              <div className="mb-[32px] xl:mb-[35px]">
                <div className="mb-2 xl:mb-4">
                  {data.type === 'community' && (
                    <Avatar
                      type="community"
                      size="80"
                      name={data.info.displayName}
                      src={avatarURL}
                    />
                  )}
                  {data.type === 'channel' && (
                    <Avatar
                      type="channel"
                      name={data.info.displayName}
                      emoji={data.info.emoji}
                      size="80"
                      // fixme: use `data.info.color` (e.g. #000000 format)
                      // backgroundColor="$neutral-100"
                    />
                  )}
                  {data.type === 'profile' && (
                    <Avatar
                      type="user"
                      name={data.info.displayName}
                      src={avatarURL}
                      size="80"
                      colorHash={data.info.colorHash}
                    />
                  )}
                </div>

                <h1 className="mb-3 text-40 font-semibold xl:text-64">
                  {data.type === 'channel' && '#'}
                  {data.info.displayName}
                </h1>
                <p className="mb-4 text-15 font-regular text-neutral-100 xl:text-19">
                  {data.info.description}
                </p>

                {data.type === 'community' && (
                  <>
                    <div className="mb-4 flex items-center gap-1">
                      <MembersIcon className="text-neutral-50" />
                      <p className="text-15">
                        {formatNumber(data.info.membersCount)}
                      </p>
                    </div>
                    {data.info.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-[6px] xl:gap-[11px]">
                        {data.info.tags.map(tag => (
                          <Tag
                            key={tag.emoji + tag.text}
                            size="32"
                            icon={<>{tag.emoji}</>}
                            label={tag.text}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
                {data.type === 'channel' && (
                  <div className="flex items-center gap-1">
                    <p className="text-13 text-neutral-40">Channel in</p>
                    <ContextTag
                      size="32"
                      type="community"
                      label={data.info.community.displayName}
                      icon={
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getAvatarURL({
                            type: 'community',
                            info: data.info.community as CommunityInfo,
                          })}
                          alt={data.info.community.displayName}
                        />
                      }
                    />
                  </div>
                )}
                {data.type === 'profile' && (
                  <p className="text-15 lg:text-19">{data.info.emojiHash}</p>
                )}
              </div>

              <p className="mb-4 text-15 font-regular text-neutral-100 xl:text-19">
                {INSTRUCTIONS_HEADING[type]}
              </p>

              {/* INSTRUCTIONS */}
              <div className="mb-6 grid gap-3">
                <div className="rounded-16 border border-neutral-10 bg-white-100 px-4 py-3">
                  <h3 className="mb-2 text-15 font-semibold">
                    Don&apos;t have Status yet?
                  </h3>
                  <ul>
                    <ListItem order={1} alignment="top">
                      <div className="flex flex-wrap gap-2">
                        <DownloadDesktopButton
                          size="24"
                          variant="primary"
                          show="all"
                        />
                        <span>Our next-gen mobile app is in the works</span>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="24"
                            variant="outline"
                            href={LEARN_MORE_MOBILE_APP_URL}
                            iconAfter={<ExternalIcon className="ml-[2px]" />}
                          >
                            Learn more
                          </Button>

                          <DownloadMobileButton>
                            <Button
                              size="24"
                              variant="outline"
                              iconAfter={<DownloadIcon className="ml-[2px]" />}
                            >
                              Current Mobile App
                            </Button>
                          </DownloadMobileButton>
                        </div>
                      </div>
                    </ListItem>
                    <ListItem order={2}>
                      <p className="text-13">Install Status</p>
                    </ListItem>
                    <ListItem order={3}>
                      <p className="text-13">
                        Complete the onboarding and keep Status open
                      </p>
                    </ListItem>
                    <ListItem order={4} alignment="top">
                      <div className="mt-[-4px] inline-flex flex-col justify-end gap-2">
                        <div className="inline-flex">
                          <Button
                            size="24"
                            variant="grey"
                            onPress={joinHandler}
                          >
                            {JOIN_BUTTON_LABEL[type]}
                          </Button>
                        </div>
                        {url && (
                          <>
                            <p className="text-13">
                              or scan the QR code with your device
                            </p>
                            <div className="inline-flex">
                              <QrDialog value={url}>
                                <Button
                                  variant="grey"
                                  size="24"
                                  iconBefore={<QrCodeIcon />}
                                >
                                  Show QR code
                                </Button>
                              </QrDialog>
                            </div>
                          </>
                        )}
                      </div>
                    </ListItem>
                  </ul>
                </div>

                {url && (
                  <div className="flex flex-col items-start gap-4 rounded-16 border border-neutral-10 bg-white-100 p-4 pt-3">
                    <div className="flex flex-col gap-1">
                      <p className="text-15 font-semibold">
                        Have Status already?
                      </p>
                      <ListItem order={1}>
                        <p className="text-13">Open status</p>
                      </ListItem>
                      <ListItem order={2} alignment="top">
                        <div className="flex flex-col gap-2">
                          <div className="inline-flex gap-2">
                            <p className="text-13">Click on </p>{' '}
                            <div className="mt-[-3px]">
                              <Button
                                size="24"
                                variant="grey"
                                onClick={joinHandler}
                              >
                                {JOIN_BUTTON_LABEL[type]}
                              </Button>
                            </div>
                          </div>
                          <p className="text-13">
                            or scan the QR code with your device
                          </p>
                          <div className="inline-flex">
                            <QrDialog value={url}>
                              <Button
                                variant="grey"
                                size="24"
                                iconBefore={<QrCodeIcon />}
                              >
                                Show QR code
                              </Button>
                            </QrDialog>
                          </div>
                        </div>
                      </ListItem>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden p-2 xl:block">
            <div
              style={{
                backgroundColor: neutral[20], // ref skeleton
              }}
              className="size-auto rounded-20"
            >
              <Image
                id="Share/Screens/Profile/Sharing_Banner:3841:3572"
                className="h-[944px] rounded-20 object-cover"
                alt="Status.app illustration for a shared profile."
                height={1888}
                width={1120}
                quality={60}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const formatNumber = (n: number) => {
  const formatter = Intl.NumberFormat('en', { notation: 'compact' })
  return formatter.format(n)
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

type ListItemProps = {
  order: number
  children: React.ReactNode
  alignment?: 'top' | 'center'
}

const ListItem = (props: ListItemProps) => {
  const { order, alignment = 'center', children } = props

  return (
    <li
      className={cx([
        'flex gap-2 py-1 text-13',
        alignment === 'top' ? 'items-start' : 'items-center',
      ])}
    >
      <Counter variant="outline" value={order} />
      {children}
    </li>
  )
}
