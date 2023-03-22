import {
  ArrowLeftIcon,
  CommunitiesIcon,
  DeleteIcon,
  DownloadIcon,
  LockedIcon,
  MembersIcon,
  MutedIcon,
  OptionsIcon,
  ShareIcon,
  UpToDateIcon,
} from '@status-im/icons/20'
import { Stack, Text as RNText } from '@tamagui/core'
import { BlurView } from 'expo-blur'

import { Divider } from '../divider'
import { DropdownMenu } from '../dropdown-menu'
import { IconButton } from '../icon-button'
import { Text } from '../text'

import type { Channel } from '../sidebar/mock-data'

type Props = {
  showMembers: boolean
  onMembersPress: () => void
  goBack?: () => void
  channel: Channel
  blur?: boolean
}

const Topbar = (props: Props) => {
  const { showMembers, onMembersPress, goBack, blur, channel } = props

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
        width="100%"
      >
        <Stack flexDirection="row" alignItems="center" flexWrap="wrap">
          <Stack mr={12} $gtSm={{ display: 'none' }}>
            <IconButton
              icon={<ArrowLeftIcon />}
              onPress={() => goBack?.()}
              blur={blur}
            />
          </Stack>

          {emoji && (
            <Stack marginRight={12}>
              <RNText>{emoji}</RNText>
            </Stack>
          )}

          {title && (
            <Text size={15} weight="semibold">
              {title}
            </Text>
          )}

          <LockedIcon color="$neutral-80-opa-40" />
          <Divider height={16} $sm={{ display: 'none' }} />
        </Stack>

        <Stack
          space={12}
          flexDirection="row"
          alignItems="center"
          justifyContent={description ? 'space-between' : 'flex-end'}
          flexGrow={1}
          flexShrink={1}
          $sm={{ justifyContent: 'flex-end' }}
        >
          {description && (
            <Stack flexGrow={1} flexShrink={1} $sm={{ display: 'none' }}>
              <Text
                weight="medium"
                color="$neutral-80-opa-50"
                size={13}
                truncate
              >
                {description}
              </Text>
            </Stack>
          )}
          <Stack $sm={{ display: 'none' }}>
            <IconButton
              icon={<MembersIcon />}
              selected={showMembers}
              onPress={onMembersPress}
              blur={blur}
            />
          </Stack>

          <DropdownMenu>
            <IconButton icon={<OptionsIcon />} />

            <DropdownMenu.Content align="end" sideOffset={4}>
              <DropdownMenu.Item
                icon={<CommunitiesIcon />}
                label="View channel members and details"
                onSelect={() => console.log('click')}
              />
              <DropdownMenu.Item
                icon={<MutedIcon />}
                label="Mute channel"
                onSelect={() => console.log('click')}
              />
              <DropdownMenu.Item
                icon={<UpToDateIcon />}
                label="Mark as read"
                onSelect={() => console.log('click')}
              />
              <DropdownMenu.Item
                icon={<DownloadIcon />}
                label="Fetch messages"
                onSelect={() => console.log('click')}
              />
              <DropdownMenu.Item
                icon={<ShareIcon />}
                label="Share link to the channel"
                onSelect={() => console.log('click')}
              />

              <DropdownMenu.Separator />

              <DropdownMenu.Item
                icon={<DeleteIcon />}
                label="Clear history"
                onSelect={() => console.log('click')}
                danger
              />
            </DropdownMenu.Content>
          </DropdownMenu>
        </Stack>
      </Stack>
    </BlurView>
  )
}

export { Topbar }
