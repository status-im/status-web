import { useEffect, useRef, useState } from 'react'

import { Stack } from '@tamagui/core'
import { Animated, FlatList, StyleSheet } from 'react-native'

import { Image } from '../../image/image'

import type { LayoutChangeEvent } from 'react-native'

const THUMBNAIL_GAP = 8
const THUMBNAIL_SIZE = 40

type Props = {
  images: string[]
  selectedImageIndex: number
  handleThumbnailPress: (index: number) => void
}

const ThumbnailCarousel = (props: Props) => {
  const { selectedImageIndex, images, handleThumbnailPress } = props

  const refThumbnailContainer = useRef(null)
  const translateX = useRef(new Animated.Value(0)).current

  const [thumbnailContainerSize, setThumbnailContainerSize] = useState({
    height: 0,
    width: 0,
  })

  const handleThumbnailContainerLayout = (event: LayoutChangeEvent) => {
    setThumbnailContainerSize({
      height: event.nativeEvent.layout.height,
      width: event.nativeEvent.layout.width,
    })
  }

  // Center the selected thumbnail
  useEffect(() => {
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
  }, [selectedImageIndex, thumbnailContainerSize.width, translateX])

  return (
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
                  // ref={thumbnailRef}
                  src={item}
                  width="full"
                  height="100%"
                  borderRadius={12}
                />
              </Stack>
            )
          }}
        />
      </Animated.View>
    </Stack>
  )
}

export { ThumbnailCarousel }

const styles = StyleSheet.create({
  thumbnailsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
})
