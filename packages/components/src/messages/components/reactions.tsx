import { XStack } from 'tamagui'

import { Dialog } from '../../dialog'
import { ReactButton } from '../../react-button'
import { Tooltip } from '../../tooltip/tooltip'
import { UserList } from '../../user-list'
import { ReactionPopover } from './reaction-popover'

import type { ReactButtonProps } from '../../react-button'
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
      {Object.entries(reactions).map(([type, value]) => (
        <Reaction
          key={type}
          size="compact"
          icon={type as ReactionType}
          count={value.size}
          selected={value.has('me')}
        />
      ))}

      <ReactionPopover
        reactions={reactions}
        side="bottom"
        align="start"
        sideOffset={8}
      >
        <ReactButton size="compact" icon="add" selected={false} />
      </ReactionPopover>
    </XStack>
  )
}

const Reaction = (props: ReactButtonProps) => {
  return (
    <Dialog press="long">
      <Tooltip
        side="bottom"
        sideOffset={4}
        content={
          <>
            You, Mr Gandalf, Ariana Perlona and
            <button>3 more</button> reacted with {'[ICON]'}
          </>
        }
      >
        <ReactButton {...props} />
      </Tooltip>

      <Dialog.Content>
        <UserList
          users={[
            {
              name: 'Pedro',
              src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
              address: 'zQ3...9d4Gs0',
              indicator: 'online',
            },
            {
              name: 'Pedro',
              src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
              address: 'zQ3...9d4Gs0',
              indicator: 'online',
            },
            {
              name: 'Pedro',
              src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
              address: 'zQ3...9d4Gs0',
              indicator: 'online',
            },
            {
              name: 'Pedro',
              src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
              address: 'zQ3...9d4Gs0',
              indicator: 'online',
            },
            {
              name: 'Pedro',
              src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
              address: 'zQ3...9d4Gs0',
              indicator: 'online',
            },
            {
              name: 'Pedro',
              src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
              address: 'zQ3...9d4Gs0',
              indicator: 'online',
            },
          ]}
        />
      </Dialog.Content>
    </Dialog>
  )
}
