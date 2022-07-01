import React from 'react'

import { useMembers, useProtocol } from '../../../../protocol'
import { styled } from '../../../../styles/config'
import { Avatar, DialogTrigger, Text } from '../../../../system'
import { CommunityDialog } from './community-dialog'

export const CommunityInfo = () => {
  const { community } = useProtocol()
  const members = useMembers()

  const { displayName, color } = community.identity!

  return (
    <DialogTrigger>
      <Button>
        <Avatar size={36} name={displayName} color={color} />
        <div>
          <Text>{displayName}</Text>
          <Text color="gray" size={12}>
            {members.length} members
          </Text>
        </div>
      </Button>
      <CommunityDialog />
    </DialogTrigger>
  )
}

const Button = styled('button', {
  padding: '4px 6px',
  display: 'inline-flex',
  alignSelf: 'flex-start',
  gap: '$2',
  borderRadius: 8,
  alignItems: 'center',

  '&:hover': {
    background: '$gray-3',
  },
})
