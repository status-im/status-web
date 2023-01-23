import React, { useState } from 'react'

import { ChevronRightIcon } from '@status-im/icons/20'
import { Stack } from '@tamagui/core'
import { AnimatePresence } from 'tamagui'

import { Label, Paragraph } from '../typography'

import type { GetProps } from '@tamagui/core'

type BaseProps = GetProps<typeof Stack>

type Props = {
  children: React.ReactElement[] | React.ReactElement
  initialExpanded: boolean
  title: string
  numberOfNewMessages?: number
} & BaseProps

const Accordion = ({
  children,
  initialExpanded,
  title,
  numberOfNewMessages,
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)
  return (
    <Stack
      width="100%"
      borderRadius="$0"
      borderTopWidth={1}
      borderTopColor="$neutral-10"
      paddingHorizontal={8}
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
            <Stack flexDirection="row" alignItems="center">
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
              <Paragraph
                marginLeft={4}
                color="$neutral-50"
                weight="medium"
                variant="smaller"
              >
                {title}
              </Paragraph>
            </Stack>
            <AnimatePresence>
              {!isExpanded && numberOfNewMessages && (
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
                    <Label color="$white-100" weight="medium">
                      {numberOfNewMessages}
                    </Label>
                  </Stack>
                </Stack>
              )}
            </AnimatePresence>
          </Stack>
          <AnimatePresence>
            {isExpanded && (
              <React.Fragment key={title}>{children}</React.Fragment>
            )}
          </AnimatePresence>
        </Stack>
      </Stack>
    </Stack>
  )
}

export { Accordion }
