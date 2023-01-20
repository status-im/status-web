import { Muted } from '@status-im/icons/20'
import { Stack } from '@tamagui/core'

import { Label, Paragraph } from '../typography'

import type { GetProps } from '@tamagui/core'

type BaseProps = GetProps<typeof Stack>

type Props = {
  isSelected?: boolean
  onToggle?: () => void
  title: string
  channelStatus?: 'muted' | 'normal' | 'withMessages' | 'withMentions'
  icon?: React.ReactNode
  numberOfMessages?: number
} & BaseProps

const textColor = {
  muted: '$neutral-40',
  normal: '$neutral-50',
  withMessages: '$neutral-100',
  withMentions: '$neutral-100',
}

const AccordionItem = ({
  icon,
  isSelected,
  title,
  channelStatus = 'normal',
  numberOfMessages,
  ...rest
}: Props) => {
  return (
    <Stack
      {...rest}
      animation={[
        'fast',
        {
          opacity: {
            overshootClamping: true,
          },
        },
      ]}
      backgroundColor={isSelected ? '$primary-50-opa-10' : 'transparent'}
      hoverStyle={{
        backgroundColor: '$primary-50-opa-5',
      }}
      borderRadius="$4"
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
    >
      <Stack
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="row"
      >
        {icon && <>{icon}</>}
        <Paragraph
          color={textColor[channelStatus]}
          weight="medium"
          marginLeft={icon ? 8 : 0}
        >
          {title}
        </Paragraph>
      </Stack>
      {channelStatus !== 'normal' && (
        <Stack>
          {channelStatus === 'withMentions' && (
            <Stack width={20} justifyContent="center" alignItems="center">
              <Stack
                backgroundColor="$turquoise-50"
                borderRadius="$4"
                width={16}
                height={16}
                justifyContent="center"
                alignItems="center"
              >
                <Label color="$white-100" weight="medium">
                  {numberOfMessages}
                </Label>
              </Stack>
            </Stack>
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
          {channelStatus === 'muted' && <Muted color="$neutral-40" />}
        </Stack>
      )}
    </Stack>
  )
}

export { AccordionItem }
