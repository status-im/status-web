import { useEffect, useRef, useState } from 'react'

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CloseIcon,
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
  ForwardIcon,
  InfoIcon,
  OptionsIcon,
  ShareIcon,
} from '@status-im/icons/20'
import { Stack, styled, Theme } from '@tamagui/core'
import { Animated, FlatList, Image as RNImage, StyleSheet } from 'react-native'

import { DropdownMenu } from '../../dropdown-menu'
import { IconButton } from '../../icon-button'
import { Image } from '../../image'
import { Text } from '../../text'

import type { KeyboardEvent } from 'react'
import type { LayoutChangeEvent } from 'react-native'

const THUMBNAIL_GAP = 8
const THUMBNAIL_SIZE = 40

type Props = {
  images: string[]
  previousMessageId?: string
  nextMessageId?: string
  onClose: () => void
  messageInfo: {
    messageId: string
    author: string
    date: string
    message?: string
  }
}

const Carousel = (props: Props) => {
  const { images, onClose, messageInfo } = props

  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [thumbnailWidth, setThumbnailWidth] = useState(0)
  const [thumbnailContainerSize, setThumbnailContainerSize] = useState({
    height: 0,
    width: 0,
  })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })

  // Refs
  const thumbnailRef = useRef<HTMLImageElement>(null)
  const refThumbnailContainer = useRef(null)
  const translateX = useRef(new Animated.Value(0)).current

  // Handlers
  const handleThumbnailPress = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleThumbnailLayout = (event: LayoutChangeEvent) => {
    setThumbnailWidth(event.nativeEvent.layout.width)
  }

  const handleThumbnailContainerLayout = (event: LayoutChangeEvent) => {
    setThumbnailContainerSize({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    })
  }

  const handlePrev = () => {
    setSelectedImageIndex(
      selectedImageIndex === 0 ? images.length - 1 : selectedImageIndex - 1
    )
  }

  const handleNext = () => {
    setSelectedImageIndex(
      selectedImageIndex === images.length - 1 ? 0 : selectedImageIndex + 1
    )
  }

  // Image Dimensions
  const aspectRatio = imageSize.width / imageSize.height

  // Effects
  // Center the selected thumbnail
  useEffect(() => {
    if (thumbnailWidth > 0) {
      // Calculate the offset to center the selected thumbnail
      const margin = THUMBNAIL_SIZE + THUMBNAIL_GAP

      const halfContainerWidth = thumbnailContainerSize.width / 2
      const halfSelectedThumbnailWidth = THUMBNAIL_SIZE / 2
      const selectedThumbnailOffset = selectedImageIndex * margin

      const toValue =
        halfContainerWidth -
        halfSelectedThumbnailWidth -
        selectedThumbnailOffset -
        THUMBNAIL_GAP

      Animated.spring(translateX, {
        toValue,
        useNativeDriver: false,
      }).start()
    }
  }, [
    thumbnailWidth,
    selectedImageIndex,
    translateX,
    thumbnailContainerSize.width,
  ])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: Event) => {
      const keyboardEvent = event as unknown as KeyboardEvent
      if (keyboardEvent.code === 'ArrowLeft') {
        // left arrow
        setSelectedImageIndex(prevIndex => Math.max(prevIndex - 1, 0))
      } else if (keyboardEvent.code === 'ArrowRight') {
        // right arrow
        setSelectedImageIndex(prevIndex =>
          Math.min(prevIndex + 1, images.length - 1)
        )
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [images.length])

  // Get image size
  useEffect(() => {
    const handleImageSize = () => {
      RNImage.getSize(images[selectedImageIndex], (width, height) => {
        setImageSize({ width, height })
      }),
        () => {
          throw new Error('Could not get image size')
        }
    }

    handleImageSize()
  }, [selectedImageIndex, images])

  return (
    <Theme name="dark">
      <Container
        padding={20}
        justifyContent="space-between"
        position="relative"
        height="100vh"
      >
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Stack flexDirection="row" alignItems="center">
            <IconButton icon={<CloseIcon />} onPress={() => onClose?.()} />
            <Stack pl={12}>
              <Text size={15} color="$white-100" weight="semibold" truncate>
                {messageInfo.author}
              </Text>
              <Text size={13} color="$white-40" weight="medium" truncate>
                {messageInfo.date}
              </Text>
            </Stack>
          </Stack>
          <Stack flexDirection="row" alignItems="center" gap={12}>
            <IconButton icon={<InfoIcon />} />
            <IconButton icon={<ShareIcon />} />
            <DropdownMenu>
              <IconButton icon={<OptionsIcon />} />
              <DropdownMenu.Content align="end" width={188}>
                <DropdownMenu.Item
                  icon={<CopyIcon />}
                  label="Copy image"
                  onSelect={() => console.log('click')}
                />
                <DropdownMenu.Item
                  icon={<DownloadIcon />}
                  label="Save image"
                  onSelect={() => console.log('click')}
                />
                <DropdownMenu.Item
                  icon={<ForwardIcon />}
                  label="Forward"
                  onSelect={() => console.log('click')}
                />
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  icon={<DeleteIcon />}
                  label="Delete for me"
                  onSelect={() => console.log('click')}
                  danger
                />
              </DropdownMenu.Content>
            </DropdownMenu>
          </Stack>
        </Stack>
        <Stack
          width="100%"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
          flex={1}
        >
          <IconButton
            variant="default"
            icon={<ArrowLeftIcon />}
            onPress={handlePrev}
            disabled={selectedImageIndex === 0}
          />
          {/* TODO Check if this is the best option that we can do */}
          <Stack
            aspectRatio={aspectRatio}
            flex={aspectRatio > 1 ? 1 : aspectRatio / 1.5}
            padding={8}
            {...(aspectRatio >= 1 && { maxWidth: '100%', maxHeight: '100%' })}
            {...(aspectRatio < 1 && { maxHeight: '100%' })}
          >
            <Image
              src={images[selectedImageIndex]}
              width="full"
              height="100%"
              borderRadius={16}
            />
          </Stack>
          <IconButton
            icon={<ArrowRightIcon />}
            onPress={handleNext}
            disabled={selectedImageIndex === images.length - 1}
          />
        </Stack>
        <Stack width="100%" justifyContent="center" alignItems="center">
          <Animated.View
            onLayout={handleThumbnailContainerLayout}
            ref={refThumbnailContainer}
            style={[
              styles.thumbnailsWrapper,
              {
                transform: [
                  {
                    translateX: translateX,
                  },
                ],
              },
            ]}
          >
            <FlatList
              style={{ overflow: 'visible' }}
              contentContainerStyle={{ alignItems: 'center' }}
              data={images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item}
              renderItem={({ item, index }) => {
                const isSelected = index === selectedImageIndex
                const isLastImage = index === images.length - 1

                return (
                  <Stack
                    role="button"
                    key={index}
                    animation="fast"
                    br="$12"
                    width={isSelected ? THUMBNAIL_SIZE * 1.4 : THUMBNAIL_SIZE}
                    height={isSelected ? THUMBNAIL_SIZE * 1.4 : THUMBNAIL_SIZE}
                    marginRight={!isLastImage ? THUMBNAIL_GAP : 0}
                    cursor="pointer"
                    onPress={() => handleThumbnailPress(index)}
                    hoverStyle={{
                      scale: isSelected ? 1 : 1.1,
                    }}
                    pressStyle={{
                      scale: 0.95,
                    }}
                  >
                    <Image
                      ref={thumbnailRef}
                      src={item}
                      width="full"
                      height="100%"
                      borderRadius={12}
                      onLayout={handleThumbnailLayout}
                    />
                  </Stack>
                )
              }}
            />
          </Animated.View>
        </Stack>
      </Container>
    </Theme>
  )
}

export { Carousel }
export type { Props as CarouselProps }

const Container = styled(Stack, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$neutral-100',
  height: '100%',
  overflow: 'hidden',
})

const styles = StyleSheet.create({
  thumbnailsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
})
