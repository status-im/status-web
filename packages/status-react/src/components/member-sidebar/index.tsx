import React from 'react'

import { useAccount, useMembers } from '../../protocol'
import { styled } from '../../styles/config'
import { Grid, Heading } from '../../system'
import { MemberGroup } from './member-group'
import { MemberItem } from './member-item'
import { UserItem } from './user-item'

export function MemberSidebar() {
  const { account } = useAccount()
  const members = useMembers()

  return (
    <Wrapper>
      <Heading size="15" css={{ marginBottom: '$3' }}>
        Members
      </Heading>
      <Grid gap="2">
        {account && (
          <MemberGroup label="You">
            <UserItem account={account} />
          </MemberGroup>
        )}
        <MemberGroup label="All">
          {members.map(member => (
            <MemberItem
              key={member.publicKey}
              verified={false}
              untrustworthy={false}
              // indicator=""
              member={member}
            />
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
