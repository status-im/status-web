import { InfoIcon } from '@felicio/icons'
import { Stack, styled } from '@tamagui/core'

import { Text } from '../text'
import { Tooltip } from '../tooltip'

const NUM_CIRCLES = 200

type Props = {
  startDate: string
  endDate: string
  message: string
  tooltipMessage: string
}

// TODO try to find a solution for the inset shadow
const GapMessages = (props: Props) => {
  const { startDate, endDate, message, tooltipMessage } = props

  return (
    <Stack backgroundColor="$neutral-5" width="100%">
      <Stack>
        <Stack flexDirection="row" width="100%" overflow="hidden" mt={-4}>
          <Circles />
        </Stack>
        <Stack py={20} flexDirection="row">
          <Stack
            height="auto"
            minHeight="100%"
            justifyContent="space-between"
            alignItems="center"
            py={5}
            pr={16}
            pl={28}
          >
            <EmptyCircle />
            <Divider flex={1} />
            <EmptyCircle />
          </Stack>
          <Stack>
            <Text size={11} color="$neutral-50">
              {startDate}
            </Text>
            <Stack py={16}>
              <Text size={15} truncate>
                {message}
              </Text>
            </Stack>
            <Text size={11} color="$neutral-50">
              {endDate}
            </Text>
          </Stack>
        </Stack>
        <Stack position="absolute" right={26} top={20}>
          <Tooltip side="bottom" sideOffset={4} content={<>{tooltipMessage}</>}>
            <Stack width={20}>
              <InfoIcon size={16} color="$neutral-50" />
            </Stack>
          </Tooltip>
        </Stack>
        <Stack flexDirection="row" width="100%" overflow="hidden" mb={-4}>
          <Circles />
        </Stack>
      </Stack>
    </Stack>
  )
}

export { GapMessages }
export type { Props as GapMessageProps }

// TODO try to find a responsive solution if we need to keep the circles in the future
const Circles = () => {
  return (
    <>
      {[...Array(NUM_CIRCLES)].map((_, i) => (
        <Circle key={i} />
      ))}
    </>
  )
}

const Circle = styled(Stack, {
  name: 'Circle',
  width: 8,
  height: 8,
  borderRadius: '$4',
  backgroundColor: '$neutral-5',
  marginRight: 7,
})

const EmptyCircle = styled(Stack, {
  name: 'EmptyCircle',
  width: 8,
  height: 8,
  borderRadius: '$4',
  backgroundColor: 'transparent',
  borderWidth: 1,
  borderColor: '$neutral-40',
})

const Divider = styled(Stack, {
  name: 'Divider',
  backgroundColor: '$neutral-40',
  borderWidth: 1,
  borderColor: '$neutral-5',
  borderStyle: 'dashed',
  width: 1,
  height: 'auto',
})
