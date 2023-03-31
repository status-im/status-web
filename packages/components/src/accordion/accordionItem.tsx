import { MutedIcon } from '@status-im/icons/20'
import { Stack, Text as RNText } from '@tamagui/core'

import { Counter } from '../counter'
import { Text } from '../text'

import type { Channel } from '../sidebar/mock-data'
import type { ColorTokens } from '@tamagui/core'

type Props = {
  selected?: boolean
  onPress?: () => void
  channel: Channel
}

const textColors: Record<NonNullable<Channel['channelStatus']>, ColorTokens> = {
  muted: '$neutral-40',
  normal: '$neutral-50',
  withMessages: '$neutral-100',
  withMentions: '$neutral-100',
}

const AccordionItem = (props: Props) => {
  const { channel, selected, onPress } = props

  const { emoji, title, channelStatus = 'normal', unreadCount } = channel

  return (
    <Stack
      accessibilityRole="button"
      animation={[
        'fast',
        {
          opacity: {
            overshootClamping: true,
          },
        },
      ]}
      backgroundColor={selected ? '$primary-50-opa-10' : 'transparent'}
      hoverStyle={{
        backgroundColor: '$primary-50-opa-5',
      }}
      borderRadius="$12"
      padding={8}
      width="100%"
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
      opacity={1}
      justifyContent={
        channelStatus === 'normal' ? 'flex-start' : 'space-between'
      }
      alignItems="center"
      flexDirection="row"
      cursor="pointer"
      onPress={onPress}
    >
      <Stack
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
      >
        {emoji && (
          <Stack
            width={24}
            height={24}
            borderRadius="$12"
            backgroundColor="$turquoise-50-opa-10"
            justifyContent="center"
            alignItems="center"
            marginRight={10}
          >
            <RNText>{emoji}</RNText>
          </Stack>
        )}
        <Text size={15} color={textColors[channelStatus]} weight="medium">
          {title}
        </Text>
      </Stack>
      {channelStatus !== 'normal' && (
        <Stack>
          {channelStatus === 'withMentions' && unreadCount && (
            <Counter value={unreadCount} />
          )}
          {channelStatus === 'withMessages' && (
            <Stack
              width={20}
              height={20}
              justifyContent="center"
              alignItems="center"
            >
              <Stack
                backgroundColor="$neutral-40"
                borderRadius="$4"
                width={8}
                height={8}
                justifyContent="center"
                alignItems="center"
              />
            </Stack>
          )}
          {channelStatus === 'muted' && <MutedIcon color="$neutral-40" />}
        </Stack>
      )}
    </Stack>
  )
}

export { AccordionItem }
