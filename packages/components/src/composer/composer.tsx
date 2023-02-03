import {
  AudioIcon,
  FormatIcon,
  ImageIcon,
  ReactionIcon,
} from '@status-im/icons/20'
import { Stack, XStack, YStack } from 'tamagui'

import { IconButton } from '../icon-button'
import { Input } from '../input'

import type { GetProps } from '@tamagui/core'

type BaseProps = GetProps<typeof YStack>

const Composer = (
  props: BaseProps & {
    placeholderTextColor?: BaseProps['backgroundColor']
    iconOptionsColor?: BaseProps['backgroundColor']
    isBlurred?: boolean
  }
) => {
  const {
    backgroundColor,

    isBlurred,
    ...rest
  } = props

  const applyVariantStyles = isBlurred
    ? { blurred: true }
    : { transparent: true }

  return (
    <YStack
      backgroundColor={backgroundColor || '$background'}
      shadowColor="rgba(9, 16, 28, 0.08)"
      shadowOffset={{ width: 0, height: -4 }}
      shadowRadius={20}
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
      px={16}
      pt={8}
      width="100%"
      style={{
        elevation: 10,
      }}
      {...rest}
    >
      <Input
        className="composer-input"
        placeholder="Type something..."
        px={0}
        blurred={isBlurred}
      />
      <XStack
        alignItems="center"
        justifyContent="space-between"
        pt={8}
        backgroundColor="transparent"
      >
        <Stack space={12} flexDirection="row" backgroundColor="transparent">
          <IconButton icon={<ImageIcon />} {...applyVariantStyles} />
          <IconButton icon={<ReactionIcon />} {...applyVariantStyles} />
          <IconButton icon={<FormatIcon />} {...applyVariantStyles} />
        </Stack>
        <IconButton icon={<AudioIcon />} {...applyVariantStyles} />
      </XStack>
    </YStack>
  )
}

export { Composer }
