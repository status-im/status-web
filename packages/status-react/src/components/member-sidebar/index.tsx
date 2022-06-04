import React from 'react'

import { styled } from '~/src/styles/config'
import { Grid, Heading } from '~/src/system'

import { MemberGroup } from './member-group'
import { MemberItem } from './member-item'
import { UserItem } from './user-item'
import { useMembers } from '~/src/protocol'

export function MemberSidebar() {
  const members = useMembers()

  return (
    <Wrapper>
      <Heading size="15" css={{ marginBottom: '$3' }}>
        Members
      </Heading>
      <Grid gap="2">
        <MemberGroup label="You">
          <UserItem />
        </MemberGroup>
        <MemberGroup label="Online">
          {members.map(member => (
            <MemberItem
              key={member}
              verified={false}
              untrustworthy={false}
              indicator="online"
              chatKey={member}
            >
              {member}
            </MemberItem>
          ))}
        </MemberGroup>
        {/* <MemberGroup label="Offline"></MemberGroup> */}
      </Grid>
    </Wrapper>
  )
}

const Wrapper = styled('div', {
  width: 256,
  flexShrink: 0,
  padding: '18px 16px',
  display: 'none',
  backgroundColor: '$gray-4',
  overflowY: 'scroll',

  '@large': {
    display: 'block',
  },
})
