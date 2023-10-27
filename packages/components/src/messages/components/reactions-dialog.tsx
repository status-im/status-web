import { useMemo } from 'react'

import { Stack } from '@tamagui/web'

import { Dialog } from '../../dialog'
import { REACTIONS_ICONS } from '../../react-button/react-button'
import { Tabs } from '../../tabs'
import { UserList } from '../../user-list'

import type { UserListProps } from '../../user-list'
import type { ReactionsType, ReactionType } from '../types'

type Props = {
  initialReactionType: ReactionType
  reactions: ReactionsType
}

export const ReactionsDialog = (props: Props) => {
  const { initialReactionType, reactions } = props

  const users: UserListProps['users'] = useMemo(() => {
    return [
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
    ]
  }, [reactions])

  return (
    <Dialog.Content width={352} borderRadius="$12">
      <Tabs defaultValue={initialReactionType}>
        <Stack padding={16}>
          <Tabs.List variant="grey" size={24}>
            {Object.entries(reactions).map(([reaction, value]) => {
              const Icon = REACTIONS_ICONS[reaction as keyof ReactionsType]
              return (
                <Tabs.Trigger
                  type="icon"
                  key={reaction}
                  value={reaction}
                  icon={<Icon size={20} />}
                >
                  {value.size.toString()}
                </Tabs.Trigger>
              )
            })}
          </Tabs.List>
        </Stack>
        <Stack padding={8} paddingTop={0}>
          {Object.entries(reactions).map(([reaction]) => {
            return (
              <Tabs.Content key={reaction} value={reaction}>
                <UserList users={users} />
              </Tabs.Content>
            )
          })}
        </Stack>
      </Tabs>
    </Dialog.Content>
  )
}
