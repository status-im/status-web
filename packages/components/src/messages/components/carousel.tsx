import { useEffect, useRef, useState } from 'react'

import { ArrowLeftIcon, ArrowRightIcon } from '@status-im/icons/20'
import { Stack, styled, Theme } from '@tamagui/core'
import { Animated, FlatList, Image as RNImage, StyleSheet } from 'react-native'
import { useWindowDimensions } from 'tamagui'

import { IconButton } from '../../icon-button'
import { Image } from '../../image'

import type { LayoutChangeEvent } from 'react-native'

const THUMBNAIL_GAP = 8
const THUMBNAIL_SIZE = 40

export const Carousel = ({ images }: { images: string[] }) => {
  const dimensions = useWindowDimensions()
  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [thumbnailWidth, setThumbnailWidth] = useState(0)
  const [thumbnailContainerSize, setThumbnailContainerSize] = useState({
    height: 0,
    width: 0,
  })

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

  const [imageWidth, setImageWidth] = useState(0)
  const [imageHeight, setImageHeight] = useState(0)

  useEffect(() => {
    const handleImageSize = () => {
      RNImage.getSize(images[selectedImageIndex], (width, height) => {
        setImageWidth(width)
        setImageHeight(height)
      })
    }

    handleImageSize()
  }, [selectedImageIndex, images])

  const aspectRatio = imageWidth / imageHeight
  const scaledWidth = dimensions.height * aspectRatio
  const scaledHeight = dimensions.width / aspectRatio

  // Effects
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

  return (
    <Theme name="dark">
      <Container
        padding={20}
        justifyContent="flex-end"
        position="relative"
        height={dimensions.height - 32}
      >
        <Stack
          width="100%"
          height="100%"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
        >
          <IconButton
            variant="default"
            icon={<ArrowLeftIcon />}
            onPress={handlePrev}
          />

          <Stack px={16}>
            <Image
              width={Math.min(dimensions.width, scaledWidth)}
              height={Math.min(dimensions.height, scaledHeight)}
              src={images[selectedImageIndex]}
              resizeMode="contain"
              radius={16}
            />
          </Stack>

          <IconButton icon={<ArrowRightIcon />} onPress={handleNext} />
        </Stack>
        <Stack
          width="100%"
          p={20}
          justifyContent="center"
          alignItems="center"
          position="absolute"
          bottom={0}
          zIndex={20}
        >
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
                    key={index}
                    animation="fast"
                    br="$12"
                    width={isSelected ? THUMBNAIL_SIZE * 1.4 : THUMBNAIL_SIZE}
                    height={isSelected ? THUMBNAIL_SIZE * 1.4 : THUMBNAIL_SIZE}
                    marginRight={!isLastImage ? THUMBNAIL_GAP : 0}
                    cursor="pointer"
                    onPress={() => handleThumbnailPress(index)}
                    hoverStyle={{
                      scale: 1.1,
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
    height: 100,
  },
})
