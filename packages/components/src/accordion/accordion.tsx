import React from 'react'

import { Stack } from '@tamagui/core'
import { AnimatePresence, ListItem, YGroup } from 'tamagui'

import { Chevron } from '../icon'
import { Paragraph } from '../typography'

import type { GetProps } from '@tamagui/core'

type BaseProps = GetProps<typeof YGroup>

type Props = {
  children: React.ReactElement[] | React.ReactElement
  isExpanded: boolean
  onToggle?: () => void
  title: string
} & BaseProps

const Accordion = ({ children, isExpanded, onToggle, title }: Props) => {
  return (
    <YGroup
      w="100%"
      borderRadius="$0"
      borderTopWidth={1}
      borderTopColor="$neutral-10"
    >
      <ListItem size={20} justifyContent="flex-start">
        <Stack width="100%">
          <Stack
            flexDirection="row"
            alignItems="center"
            cursor="pointer"
            py={8}
            onPress={onToggle}
          >
            <Stack
              animation="fast"
              transform={[{ rotateZ: isExpanded ? '90deg' : '0deg' }]}
            >
              <Chevron color="$neutral-50" size={20} />
            </Stack>
            <Paragraph
              marginLeft={8}
              color="$neutral-50"
              weight="medium"
              variant="smaller"
            >
              {title}
            </Paragraph>
          </Stack>
          <AnimatePresence>
            {isExpanded && (
              <React.Fragment key={title}>{children}</React.Fragment>
            )}
          </AnimatePresence>
        </Stack>
      </ListItem>
    </YGroup>
  )
}

export { Accordion }
