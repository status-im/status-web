import React, { useMemo } from 'react'

import { useMessengerContext } from '../../contexts/messengerProvider'
import { MembersList } from '../Members/MembersList'

import { ListWrapper, NarrowTopbar } from './NarrowTopbar'

interface NarrowMembersProps {
  switchShowMembersList: () => void
}

export function NarrowMembers({ switchShowMembersList }: NarrowMembersProps) {
  const { activeChannel } = useMessengerContext()
  const listName = useMemo(
    () =>
      activeChannel && activeChannel?.type === 'group'
        ? 'Group members'
        : 'Community members',
    [activeChannel]
  )

  return (
    <ListWrapper>
      <NarrowTopbar list={listName} onBtnClick={switchShowMembersList} />
      <MembersList />
    </ListWrapper>
  )
}
