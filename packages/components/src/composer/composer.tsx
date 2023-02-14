import { useState } from 'react'

import { useImageUpload } from '@status-im/components/hooks'
import {
  ArrowUpIcon,
  AudioIcon,
  ClearIcon,
  FormatIcon,
  ImageIcon,
  ReactionIcon,
} from '@status-im/icons/20'
import { BlurView } from 'expo-blur'
import { AnimatePresence, Stack, XStack, YStack } from 'tamagui'

import { IconButton } from '../icon-button'
import { Image } from '../image'
import { Input } from '../input'

import type { GetProps } from '@tamagui/core'

type BaseProps = GetProps<typeof YStack>

const Composer = (
  props: Omit<BaseProps, 'style'> & {
    placeholderTextColor?: BaseProps['backgroundColor']
    iconOptionsColor?: BaseProps['backgroundColor']
    isBlurred?: boolean
  }
) => {
  const { isBlurred: isBlurredFromProps, ...rest } = props

  const [isFocused, setIsFocused] = useState(false)
  const [text, setText] = useState('')

  const {
    imagesData,
    handleImageUpload,
    handleImageRemove,
    imageUploaderInputRef,
    isDisabled: isImageUploadDisabled,
  } = useImageUpload()

  const isBlurred = isBlurredFromProps && imagesData.length === 0 && !isFocused

  const applyVariantStyles:
    | {
        blurred: boolean
      }
    | undefined = isBlurred ? { blurred: true } : undefined

  return (
    <BlurView
      intensity={40}
      style={{
        borderRadius: 20,
        width: '100%',
      }}
    >
      <YStack
        animation="fast"
        backgroundColor={isBlurred ? '$blurBackground' : '$background'}
        shadowColor={!isBlurred ? 'rgba(9, 16, 28, 0.08)' : 'none'}
        shadowOffset={{ width: 4, height: isBlurred ? 0 : 4 }}
        shadowRadius={20}
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        px={16}
        pt={8}
        pb={12}
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
          onChangeText={setText}
        />
        <input
          ref={imageUploaderInputRef}
          type="file"
          multiple
          onChange={handleImageUpload}
          hidden
          id="image-uploader-input"
          style={{
            display: 'none',
          }}
        />
        <AnimatePresence>
          {imagesData.length > 0 && (
            <XStack
              key="images-thumbnails"
              paddingTop={12}
              paddingBottom={8}
              overflow="scroll"
            >
              {imagesData.map((imageData, index) => (
                <Stack
                  key={index + imageData}
                  mr={12}
                  position="relative"
                  justifyContent="flex-end"
                  flexDirection="row"
                  alignItems="flex-start"
                  animation={[
                    'fast',
                    {
                      opacity: {
                        overshootClamping: true,
                      },
                    },
                  ]}
                  enterStyle={{ opacity: 0 }}
                  exitStyle={{ opacity: 0 }}
                  opacity={1}
                >
                  <Image
                    src={imageData}
                    width={56}
                    height={56}
                    radius={12}
                    aspectRatio={1}
                  />
                  <Stack
                    zIndex={8}
                    onPress={() => handleImageRemove(index)}
                    cursor="pointer"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Stack
                      backgroundColor="$background"
                      width={15}
                      height={15}
                      borderRadius={7}
                      position="absolute"
                      zIndex={1}
                    />
                    <Stack position="absolute" zIndex={2} width={20}>
                      <ClearIcon color="$neutral-50" />
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </XStack>
          )}
        </AnimatePresence>
        <XStack
          alignItems="center"
          justifyContent="space-between"
          pt={8}
          backgroundColor="transparent"
        >
          <Stack space={12} flexDirection="row" backgroundColor="transparent">
            <label htmlFor="image-uploader-input">
              <IconButton
                variant="outline"
                icon={<ImageIcon />}
                disabled={isImageUploadDisabled}
                {...applyVariantStyles}
              />
            </label>
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
          {text || imagesData.length > 0 ? (
            // TODO change this to be the button icon only variant when available
            <IconButton icon={<ArrowUpIcon />} {...applyVariantStyles} />
          ) : (
            <IconButton
              variant="outline"
              icon={<AudioIcon />}
              {...applyVariantStyles}
            />
          )}
        </XStack>
      </YStack>
    </BlurView>
  )
}

export { Composer }
