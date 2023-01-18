import React from 'react'

import { Stack } from '@tamagui/core'
import { AnimatePresence } from 'tamagui'

import { Chevron } from '../icon'
import { Label, Paragraph } from '../typography'

import type { GetProps } from '@tamagui/core'

type BaseProps = GetProps<typeof Stack>

type Props = {
  children: React.ReactElement[] | React.ReactElement
  isExpanded: boolean
  onToggle?: () => void
  title: string
  numberOfNewMessages?: number
  showNotifications?: boolean
} & BaseProps

const Accordion = ({
  children,
  isExpanded,
  onToggle,
  title,
  numberOfNewMessages,
  showNotifications,
}: Props) => {
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
            onPress={onToggle}
            cursor="pointer"
            py={8}
          >
            <Stack flexDirection="row" alignItems="center">
              <Stack
                animation="fast"
                transform={[{ rotateZ: isExpanded ? '90deg' : '0deg' }]}
              >
                <Chevron color="$neutral-50" size={16} />
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
              {showNotifications && numberOfNewMessages && (
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
