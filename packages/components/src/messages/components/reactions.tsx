import { createElement, useState } from 'react'

import { Stack, XStack } from 'tamagui'

import { Dialog } from '../../dialog'
import { ReactButton } from '../../react-button'
import { REACTIONS_ICONS } from '../../react-button/react-button'
import { Text } from '../../text'
import { Tooltip } from '../../tooltip/tooltip'
import { ReactionPopover } from './reaction-popover'
import { ReactionsDialog } from './reactions-dialog'

import type { ReactionsType, ReactionType } from '../types'

type Props = {
  reactions: ReactionsType
}

export const Reactions = (props: Props) => {
  const { reactions } = props

  const hasReaction = Object.values(reactions).some(value => value.size > 0)

  if (hasReaction === false) {
    return null
  }

  return (
    <XStack space={6} flexWrap="wrap">
      {Object.keys(reactions).map(type => (
        <Reaction
          key={type}
          type={type as ReactionType}
          reactions={reactions}
        />
      ))}

      <ReactionPopover
        reactions={reactions}
        side="bottom"
        align="start"
        sideOffset={8}
      >
        <ReactButton type="add" />
      </ReactionPopover>
    </XStack>
  )
}

type ReactionProps = {
  type: ReactionType
  reactions: ReactionsType
}

const Reaction = (props: ReactionProps) => {
  const { type, reactions } = props

  const value = reactions[type]!
  const icon = REACTIONS_ICONS[type]

  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <Dialog press="long" open={dialogOpen} onOpenChange={setDialogOpen}>
      <Tooltip
        side="bottom"
        sideOffset={4}
        content={
          <Stack
            tag="button"
            cursor="pointer"
            onPress={() => setDialogOpen(true)}
          >
            <Text size={13} weight="medium" color="$neutral-100">
              You, Mr Gandalf, Ariana Perlona
            </Text>
            <Stack flexDirection="row" alignItems="center" gap={4}>
              <Text size={13} weight="medium" color="$neutral-100">
                and
              </Text>
              <Stack
                backgroundColor="$turquoise-50-opa-10"
                borderRadius="$6"
                paddingHorizontal={4}
              >
                <Text size={13} weight="medium" color="$turquoise-50">
                  3 more
                </Text>
              </Stack>
              <Text size={13} weight="medium" color="$neutral-100">
                reacted with
              </Text>
              {createElement(icon)}
            </Stack>
          </Stack>
        }
      >
        <ReactButton
          type={type as ReactionType}
          count={value.size}
          selected={value.has('me')}
        />
      </Tooltip>
      <ReactionsDialog initialReactionType={type} reactions={reactions} />
    </Dialog>
  )
}
