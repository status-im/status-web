import { Stack } from '@tamagui/core'

import { DividerLabel } from '../../dividers'
import { UserList } from '../../user-list'

import type { UserListProps } from '../../user-list'

// type Props = {
//   users: []
// }

const SidebarMembers = () => {
  return (
    <Stack
      backgroundColor="$white-100"
      borderLeftWidth={1}
      borderColor="$neutral-10"
      overflow="scroll"
      height="100%"
    >
      <Group
        label="Admin"
        users={[
          {
            name: 'Pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'online',
          },
        ]}
      />
      <Group
        label="Online"
        users={[
          {
            name: 'Pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'online',
            status: 'untrustworthy',
          },
          {
            name: 'Pedro',
            nickname: 'pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'online',
          },
          {
            name: 'Pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'online',
            status: 'contact',
          },
          {
            name: 'Pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'online',
            status: 'verified',
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
      <Group
        label="Offline"
        users={[
          {
            name: 'Pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'offline',
            status: 'verified',
          },
          {
            name: 'Pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'offline',
          },
          {
            name: 'Pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'offline',
          },
          {
            name: 'Pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'offline',
            status: 'verified',
          },
          {
            name: 'Pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'offline',
          },
          {
            name: 'Pedro',
            src: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80',
            address: 'zQ3...9d4Gs0',
            indicator: 'offline',
            status: 'contact',
          },
        ]}
      />
    </Stack>
  )
}

export { SidebarMembers }

type GroupProps = {
  label: string
  users: UserListProps['users']
}

const Group = (props: GroupProps) => {
  const { label, users } = props

  return (
    <Stack paddingBottom={8}>
      <DividerLabel label={label} tight={false} />
      <Stack paddingHorizontal={8}>
        <UserList users={users} />
      </Stack>
    </Stack>
  )
}
