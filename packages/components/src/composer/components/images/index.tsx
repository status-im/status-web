import { ClearIcon } from '@status-im/icons'
import { AnimatePresence, Stack, XStack } from 'tamagui'

import { Image } from '../../../image'

import type { ImagePickerAsset } from 'expo-image-picker'

type Props = {
  images: ImagePickerAsset[]
  onRemove: (uri: string) => void
}

const Images = (props: Props) => {
  const { images, onRemove } = props

  return (
    <AnimatePresence>
      <XStack
        key="images-thumbnails"
        paddingTop={12}
        paddingBottom={8}
        overflow="scroll"
      >
        {images.map(image => (
          <Stack
            key={image.uri}
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
              src={image.uri}
              width={56}
              height={56}
              radius={12}
              aspectRatio={1}
            />
            <Stack
              zIndex={8}
              onPress={() => onRemove(image.uri)}
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
                <ClearIcon size={20} color="$neutral-50" />
              </Stack>
            </Stack>
          </Stack>
        ))}
      </XStack>
    </AnimatePresence>
  )
}

export { Images }
