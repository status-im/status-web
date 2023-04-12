import { ArrowLeftIcon, ArrowRightIcon } from '@status-im/icons/20'
import { Stack } from '@tamagui/core'

import { IconButton } from '../../icon-button'
import { Image } from '../../image/image'

type Props = {
  aspectRatio: number
  image: string
  handleNext: () => void
  handlePrevious: () => void
  nextDisabled?: boolean
  previousDisabled?: boolean
}

const ImageSelected = (props: Props) => {
  const {
    aspectRatio,
    image,
    handleNext,
    handlePrevious,
    nextDisabled,
    previousDisabled,
  } = props

  return (
    <Stack
      width="100%"
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      flex={1}
    >
      <IconButton
        variant="dark"
        icon={<ArrowLeftIcon />}
        onPress={handlePrevious}
        disabled={previousDisabled}
      />
      {/* TODO Check if this is the best option that we can do */}
      <Stack
        aspectRatio={aspectRatio}
        flex={aspectRatio / 1.8}
        padding={8}
        {...(aspectRatio >= 1 && { maxWidth: '100%', maxHeight: '100%' })}
        {...(aspectRatio < 1 && { maxHeight: '100%' })}
      >
        <Image
          src={image}
          width="full"
          height="100%"
          borderRadius={16}
          zIndex="$0"
        />
      </Stack>
      <IconButton
        variant="dark"
        icon={<ArrowRightIcon />}
        onPress={handleNext}
        disabled={nextDisabled}
      />
    </Stack>
  )
}

export { ImageSelected }
