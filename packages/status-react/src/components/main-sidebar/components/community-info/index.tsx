import React from 'react'

import { useCommunity } from '~/src/protocol/use-community'
import { styled } from '~/src/styles/config'
import { Avatar, DialogTrigger, Text } from '~/src/system'

import { CommunityDialog } from './community-dialog'

export const CommunityInfo = () => {
  const { name, imageUrl, membersCount } = useCommunity()

  return (
    <DialogTrigger>
      <Button>
        <Avatar size={36} src={imageUrl} />
        <div>
          <Text>{name}</Text>
          <Text color="gray" size={12}>
            {membersCount} members
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
    background: '#E9EDF1',
  },
})
