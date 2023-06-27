import {
  ArrowLeftIcon,
  CommunitiesIcon,
  DownloadIcon,
  LockedIcon,
  MembersIcon,
  MutedIcon,
  OptionsIcon,
  ShareIcon,
  TrashIcon,
  UpToDateIcon,
} from '@felicio/icons'
import { Stack, Text as RNText } from '@tamagui/core'
import { BlurView } from 'expo-blur'

import { DropdownMenu } from '../../dropdown-menu'
import { IconButton } from '../../icon-button'
import { PinnedMessage } from '../../pinned-message'
import { TopbarSkeleton } from '../../skeleton/topbar-skeleton'
import { Text } from '../../text'

import type { MessageProps } from '../../messages'
import type { ChannelType } from '../mock-data'

type Props = {
  showMembers: boolean
  onMembersPress: () => void
  goBack?: () => void
  channel: ChannelType
  blur?: boolean
  pinnedMessages?: MessageProps[]
  loading?: boolean
}

const Topbar = (props: Props) => {
  const {
    showMembers,
    onMembersPress,
    goBack,
    blur,
    channel,
    pinnedMessages,
    loading,
  } = props

  if (loading) {
    return <TopbarSkeleton />
  }

  const { title, description, emoji } = channel

  return (
    <BlurView intensity={40} style={{ zIndex: 100 }}>
      <Stack
        flexDirection="row"
        height={56}
        alignItems="center"
        justifyContent="space-between"
        padding={16}
        backgroundColor={'$blurBackground'}
        borderBottomWidth={1}
        borderColor={blur ? 'transparent' : '$neutral-80-opa-10'}
      >
        <Stack flexDirection="row" alignItems="center" flexWrap="wrap">
          <Stack marginRight={12} $gtSm={{ display: 'none' }}>
            <IconButton
              icon={<ArrowLeftIcon size={20} />}
              onPress={() => goBack?.()}
              blur={blur}
            />
          </Stack>
          <Stack marginRight={12}>
            <RNText>{emoji}</RNText>
          </Stack>
          <Text size={15} weight="semibold">
            {title}
          </Text>
          <Stack marginLeft={4}>
            <LockedIcon size={20} color="$neutral-80-opa-40" />
          </Stack>
          <Stack
            backgroundColor="$neutral-80-opa-10"
            marginHorizontal={12}
            height={16}
            width={1}
            $sm={{ display: 'none' }}
          />
        </Stack>

        <Stack flexGrow={1} flexShrink={1} $sm={{ display: 'none' }}>
          <Text size={13} weight="medium" color="$neutral-80-opa-50" truncate>
            {description}
          </Text>
        </Stack>

        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-end"
          gap={12}
        >
          <Stack $sm={{ display: 'none' }}>
            <IconButton
              icon={<MembersIcon size={20} />}
              selected={showMembers}
              onPress={onMembersPress}
              blur={blur}
            />
          </Stack>

          <DropdownMenu>
            <IconButton icon={<OptionsIcon size={20} />} />

            <DropdownMenu.Content align="end" sideOffset={4}>
              <DropdownMenu.Item
                icon={<CommunitiesIcon size={20} />}
                label="View channel details"
                onSelect={() => console.log('click')}
              />
              <DropdownMenu.Item
                icon={<MutedIcon size={20} />}
                label="Mute channel"
                onSelect={() => console.log('click')}
              />
              <DropdownMenu.Item
                icon={<UpToDateIcon size={20} />}
                label="Mark as read"
                onSelect={() => console.log('click')}
              />
              <DropdownMenu.Item
                icon={<DownloadIcon size={20} />}
                label="Fetch messages"
                onSelect={() => console.log('click')}
              />
              <DropdownMenu.Item
                icon={<ShareIcon size={20} />}
                label="Share link to the channel"
                onSelect={() => console.log('click')}
              />

              <DropdownMenu.Separator />

              <DropdownMenu.Item
                icon={<TrashIcon size={20} />}
                label="Clear history"
                onSelect={() => console.log('click')}
                danger
              />
            </DropdownMenu.Content>
          </DropdownMenu>
        </Stack>
      </Stack>

      {pinnedMessages && pinnedMessages.length > 0 && (
        <PinnedMessage messages={pinnedMessages} />
      )}
    </BlurView>
  )
}

export { Topbar }
