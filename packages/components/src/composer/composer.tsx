import { useState } from 'react'

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
  const { backgroundColor, isBlurred, ...rest } = props

  const [isFocused, setIsFocused] = useState(false)

  const applyVariantStyles:
    | {
        blurred: boolean
      }
    | undefined = isBlurred && !isFocused ? { blurred: true } : undefined

  return (
    <YStack
      animation="fast"
      backgroundColor={isFocused ? '$background' : backgroundColor}
      shadowColor={!isBlurred || isFocused ? 'rgba(9, 16, 28, 0.08)' : 'none'}
      shadowOffset={{ width: 4, height: !isBlurred || isFocused ? 4 : 0 }}
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
        borderWidth={0}
        blurred={isBlurred}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
      />
      <XStack
        alignItems="center"
        justifyContent="space-between"
        pt={8}
        backgroundColor="transparent"
      >
        <Stack space={12} flexDirection="row" backgroundColor="transparent">
          <IconButton
            variant="outline"
            icon={<ImageIcon />}
            {...applyVariantStyles}
            selected
          />
          <IconButton
            variant="outline"
            icon={<ReactionIcon />}
            {...applyVariantStyles}
          />
          <IconButton
            variant="outline"
            icon={<FormatIcon />}
            disabled
            {...applyVariantStyles}
          />
        </Stack>
        <IconButton
          variant="outline"
          icon={<AudioIcon />}
          {...applyVariantStyles}
        />
      </XStack>
    </YStack>
  )
}

export { Composer }
