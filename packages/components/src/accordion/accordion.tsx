import { Fragment, useState } from 'react'

import { ChevronRightIcon } from '@status-im/icons/20'
import { Stack } from '@tamagui/core'
import { AnimatePresence } from 'tamagui'

import { Text } from '../text'

type Props = {
  children: React.ReactElement[] | React.ReactElement
  initialExpanded: boolean
  title: string
  unreadCount?: number
}

const Accordion = (props: Props) => {
  const { children, initialExpanded, title, unreadCount } = props

  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  return (
    <Stack
      accessibilityRole="button"
      width="100%"
      borderRadius="$0"
      borderTopWidth={1}
      borderTopColor="$neutral-10"
      paddingHorizontal={8}
      paddingBottom={8}
    >
      <Stack justifyContent="flex-start">
        <Stack width="100%">
          <Stack
            width="100%"
            flexDirection="row"
            justifyContent={'space-between'}
            onPress={() => setIsExpanded(prev => !prev)}
            cursor="pointer"
            py={8}
          >
            <Stack flexDirection="row" alignItems="center" gap={4}>
              <Stack
                animation="fast"
                justifyContent="center"
                transform={[
                  {
                    rotateZ: isExpanded ? '90deg' : '0deg',
                  },
                  {
                    translateY: isExpanded ? -4 : 0,
                  },
                ]}
              >
                <ChevronRightIcon color="$neutral-50" />
              </Stack>
              <Text size={13} color="$neutral-50" weight="medium">
                {title}
              </Text>
            </Stack>
            <AnimatePresence>
              {!isExpanded && unreadCount !== 0 && (
                <Stack
                  key={`notifications-${title}}`}
                  width={20}
                  justifyContent="center"
                  alignItems="center"
                  mr={8}
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
                  <Stack
                    backgroundColor="$turquoise-50"
                    borderRadius="$4"
                    width={16}
                    height={16}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text size={11} color="$white-100" weight="medium">
                      {unreadCount}
                    </Text>
                  </Stack>
                </Stack>
              )}
            </AnimatePresence>
          </Stack>
          <AnimatePresence>
            {isExpanded && <Fragment key={title}>{children}</Fragment>}
          </AnimatePresence>
        </Stack>
      </Stack>
    </Stack>
  )
}

export { Accordion }
