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
import { AnimatePresence, Stack, XStack } from 'tamagui'

import { Button } from '../button'
import { IconButton } from '../icon-button'
import { Image } from '../image'
import { Input } from '../input'
import { useChatDispatch, useChatState } from '../provider'
import { Reply } from '../reply'
import { Shadow } from '../shadow'

interface Props {
  blur?: boolean
}

// pb={insets.bottom + Platform.select({ android: 12, ios: 0 })}
const Composer = (props: Props) => {
  const { blur } = props

  const [isFocused, setIsFocused] = useState(false)
  const [text, setText] = useState('')

  const {
    imagesData,
    handleImageUpload,
    handleImageRemove,
    imageUploaderInputRef,
    isDisabled: isImageUploadDisabled,
  } = useImageUpload()

  const iconButtonBlurred = blur && !isFocused && imagesData.length === 0

  const chatState = useChatState()
  const chatDispatch = useChatDispatch()

  const showSendButton = text !== '' || imagesData.length > 0

  return (
    <BlurView
      intensity={40}
      style={{
        borderRadius: 20, // hardcoded, once blur view is hooked up to theme, this should be changed to token
        width: '100%',
      }}
    >
      <Shadow
        variant={iconButtonBlurred ? 'none' : '$2'}
        inverted
        animation="fast"
        backgroundColor={iconButtonBlurred ? '$blurBackground' : '$background'}
        borderTopLeftRadius={20}
        borderTopRightRadius={20}
        px={16}
        width="100%"
        py={12}
      >
        {chatState?.type === 'reply' && (
          <Stack paddingLeft={4} paddingBottom={4}>
            <Reply
              type="text"
              name="Alisher"
              src="https://images.unsplash.com/photo-1524638431109-93d95c968f03?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2lybHx8fHx8fDE2NzM4ODQ0NzU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500"
              onClose={() => chatDispatch({ type: 'cancel' })}
            />
          </Stack>
        )}

        <Input
          className="composer-input"
          placeholder="Type something..."
          px={0}
          borderWidth={0}
          blurred={blur}
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
                      borderRadius="$8"
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
          paddingTop={12}
          backgroundColor="transparent"
        >
          <Stack space={12} flexDirection="row" backgroundColor="transparent">
            <label htmlFor="image-uploader-input">
              <IconButton
                variant="outline"
                icon={<ImageIcon />}
                disabled={isImageUploadDisabled}
                blur={iconButtonBlurred}
              />
            </label>
            <IconButton
              variant="outline"
              icon={<ReactionIcon />}
              blur={iconButtonBlurred}
            />
            <IconButton
              variant="outline"
              icon={<FormatIcon />}
              disabled
              blur={iconButtonBlurred}
            />
          </Stack>
          {showSendButton ? (
            <Button
              variant="primary"
              shape="circle"
              icon={<ArrowUpIcon />}
              size={32}
            />
          ) : (
            <Button
              variant="outline"
              icon={<AudioIcon />}
              size={32}
              // blurred={iconButtonBlurred}
            />
          )}
        </XStack>
      </Shadow>
    </BlurView>
  )
}

export { Composer }
