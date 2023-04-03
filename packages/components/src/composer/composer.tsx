import { useState } from 'react'

import {
  ArrowUpIcon,
  AudioIcon,
  FormatIcon,
  ImageIcon,
  ReactionIcon,
} from '@status-im/icons/20'
import { BlurView } from 'expo-blur'
import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker'
import { Stack, XStack } from 'tamagui'

import { Button } from '../button'
import { IconButton } from '../icon-button'
import { Input } from '../input'
import { useChatDispatch, useChatState } from '../provider'
import { Reply } from '../reply'
import { Shadow } from '../shadow'
import { Images } from './components/images'

import type { ImagePickerAsset } from 'expo-image-picker'

interface Props {
  blur?: boolean
}

const IMAGES_LIMIT = 6

// pb={insets.bottom + Platform.select({ android: 12, ios: 0 })}
const Composer = (props: Props) => {
  const { blur } = props

  const [isFocused, setIsFocused] = useState(false)

  const [text, setText] = useState('')
  const [images, setImages] = useState<ImagePickerAsset[]>([])

  const handlePickImages = async () => {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsMultipleSelection: true,
      // aspect: [4, 3],
      // quality: 1,
    })

    if (result.canceled) {
      return
    }

    const assets = result.assets.slice(0, IMAGES_LIMIT - 1) // zero-based index
    setImages(assets)
  }

  const handleImageRemove = (uri: string) => {
    setImages(prevState => prevState.filter(image => image.uri !== uri))
  }

  const iconButtonBlurred = blur && !isFocused && images.length === 0

  const chatState = useChatState()
  const chatDispatch = useChatDispatch()

  const hasImages = images.length > 0
  const canSend = text !== '' || hasImages
  const imagePickerDisabled = images.length === IMAGES_LIMIT

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

        {hasImages && <Images images={images} onRemove={handleImageRemove} />}

        <XStack
          alignItems="center"
          justifyContent="space-between"
          paddingTop={12}
          backgroundColor="transparent"
        >
          <Stack space={12} flexDirection="row" backgroundColor="transparent">
            <IconButton
              variant="outline"
              icon={<ImageIcon />}
              disabled={imagePickerDisabled}
              blur={iconButtonBlurred}
              onPress={handlePickImages}
            />
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
          {canSend ? (
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
