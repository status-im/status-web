import { useCallback, useEffect, useState } from 'react'

import { Stack } from '@tamagui/core'
import { Image as RNImage, StyleSheet } from 'react-native'
import { AnimatePresence, Square } from 'tamagui'

import { Image } from '../../image'

type Props = {
  images: string[]
  isVisible?: boolean
}

const Carousel = (props: Props): JSX.Element => {
  const { images, isVisible } = props
  const [activeIndex, setActiveIndex] = useState(0)

  // const handlePrev = () => {
  //   setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1)
  // }

  // const handleNext = () => {
  //   setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1)
  // }

  const handleThumbnailPress = (index: number) => {
    setActiveIndex(index)
    setSelectedImage(images[index])
  }

  const [selectedImage, setSelectedImage] = useState(images[0])
  const [imageOrientation, setImageOrientation] = useState('landscape')

  const getImageOrientation = useCallback((selectedImage: string) => {
    RNImage.getSize(
      selectedImage,
      (width, height) => {
        if (width > height) {
          setImageOrientation('landscape')
        } else if (width < height) {
          setImageOrientation('portrait')
        } else {
          setImageOrientation('square')
        }
      },
      errorMsg => {
        throw new Error(errorMsg)
      }
    )
  }, [])

  useEffect(() => {
    getImageOrientation(selectedImage)
  }, [getImageOrientation, selectedImage])

  return (
    <AnimatePresence>
      {isVisible && (
        <Stack
          key="carousel"
          padding={20}
          backgroundColor="$neutral-95"
          alignItems="center"
          justifyContent="space-between"
          height="100%"
        >
          <Stack
            flexGrow={1}
            height="100%"
            width="100%"
            animation={[
              'fast',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            opacity={1}
            enterStyle={{
              opacity: 1,
            }}
            exitStyle={{
              opacity: 0,
            }}
          >
            <Image
              width="full"
              radius={16}
              key="image"
              height="100%"
              src={selectedImage}
              resizeMode={
                imageOrientation === 'landscape' ? 'contain' : 'cover'
              }
              style={{
                aspectRatio: imageOrientation === 'square' ? 1 : undefined,
              }}
            />
          </Stack>

          {/* <TouchableOpacity style={styles.prevButton} onPress={handlePrev}>
        <Text style={styles.arrow}>{'<'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.arrow}>{'>'}</Text>
      </TouchableOpacity> */}
          <Stack width="100%" justifyContent="center" flexDirection="row">
            <Stack
              gap={14}
              flexDirection="row"
              mt={10}
              justifyContent="center"
              alignItems="center"
              height={92}
              width={330}
            >
              {images.map((src, index) => {
                const isSelected = index === activeIndex
                return (
                  <Stack
                    key={index}
                    animation="fast"
                    br="$12"
                    width={40}
                    height={40}
                    cursor="pointer"
                    onPress={() => handleThumbnailPress(index)}
                    hoverStyle={{
                      scale: isSelected ? 1.4 : 1.1,
                    }}
                    pressStyle={{
                      scale: isSelected ? 1.4 : 0.8,
                    }}
                    scale={isSelected ? 1.4 : 1}
                  >
                    <Image
                      src={src}
                      width="full"
                      height="100%"
                      borderRadius={12}
                    />
                  </Stack>
                )
              })}
            </Stack>
          </Stack>
        </Stack>
      )}
    </AnimatePresence>
  )
}

export { Carousel }
export type { Props as CarouselProps }

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    height: 600,
    width: '100%',
  },
  prevButton: {
    position: 'absolute',
    top: '50%',
    left: 0,
    zIndex: 1,
  },
  nextButton: {
    position: 'absolute',
    top: '50%',
    right: 0,
    zIndex: 1,
  },
  arrow: {
    fontSize: 24,
    color: '#fff',
  },
})
