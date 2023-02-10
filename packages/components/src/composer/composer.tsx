import { useState } from 'react'

import {
  AudioIcon,
  FormatIcon,
  ImageIcon,
  ReactionIcon,
} from '@status-im/icons/20'
import { BlurView } from 'expo-blur'
import { Stack, XStack, YStack } from 'tamagui'

import { IconButton } from '../icon-button'
import { Input } from '../input'

import type { GetProps } from '@tamagui/core'
import type { ViewProps } from 'react-native'

type BaseProps = GetProps<typeof YStack>

const Composer = (
  props: Omit<BaseProps, 'style'> & {
    placeholderTextColor?: BaseProps['backgroundColor']
    iconOptionsColor?: BaseProps['backgroundColor']
    isBlurred?: boolean
    style?: ViewProps['style']
  }
) => {
  const { backgroundColor, isBlurred, style: styleFromProps, ...rest } = props
  const style = styleFromProps ? Object.assign(styleFromProps) : {}

  const [isFocused, setIsFocused] = useState(false)

  const applyVariantStyles:
    | {
        blurred: boolean
      }
    | undefined = isBlurred && !isFocused ? { blurred: true } : undefined

  return (
    <BlurView
      intensity={40}
      style={{
        zIndex: 100,
        borderRadius: 20,
        ...style,
      }}
    >
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
    </BlurView>
  )
}

export { Composer }
