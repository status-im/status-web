import { useEffect, useState } from 'react'

import { Stack, styled } from '@tamagui/core'
import { Image as RNImage } from 'react-native'
import { AnimatePresence } from 'tamagui'

import { Text } from '../text'
import { ImageSelected } from './components/image-selected'
import { ThumbnailCarousel } from './components/thumbnail-carousel'
import { TopBar } from './components/top-bar'

import type { KeyboardEvent } from 'react'

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

const ImagePreview = (props: Props) => {
  const { images, onClose, messageInfo } = props

  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const [showMessageInfo, setShowMessageInfo] = useState(false)

  // Handlers
  const handleThumbnailPress = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handlePrevious = () => {
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
    <Container>
      <Stack height="100%" maxWidth="100%" flexGrow={1} animation="fast">
        <TopBar
          drawerOpen={showMessageInfo}
          onClose={onClose}
          messageInfo={messageInfo}
          onShowInfo={() => setShowMessageInfo(!showMessageInfo)}
        />
        <ImageSelected
          aspectRatio={aspectRatio}
          image={images[selectedImageIndex]}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          previousDisabled={selectedImageIndex === 0}
          nextDisabled={selectedImageIndex === images.length - 1}
        />
        <ThumbnailCarousel
          images={images}
          selectedImageIndex={selectedImageIndex}
          handleThumbnailPress={handleThumbnailPress}
        />
      </Stack>
      <AnimatePresence enterVariant="fromRight" exitVariant="fromLeft">
        {showMessageInfo && (
          <AnimatableDrawer
            key="message"
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
            <Text size={15} color="$white-100">
              {messageInfo.message}
            </Text>
          </AnimatableDrawer>
        )}
      </AnimatePresence>
    </Container>
  )
}

export { ImagePreview }
export type { Props as ImagePreviewProps }

const Container = styled(Stack, {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '$neutral-100',
  height: '100vh',
  overflow: 'hidden',
  p: 20,
})

const AnimatableDrawer = styled(Stack, {
  width: 352,
  p: 16,
  height: '100vh',
  borderLeftWidth: 1,
  ml: 8,
  borderLeftColor: '$neutral-90',
  backgroundColor: '$neutral-100',
  variants: {
    fromRight: {
      true: {
        x: 0,
        width: 352,
      },
    },
    fromLeft: {
      true: {
        x: 500,
        width: 352,
      },
    },
  },
})
