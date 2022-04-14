import React from 'react'

import { styled } from '~/src/styles/config'
import { Grid, Heading } from '~/src/system'

import { MemberGroup } from './member-group'
import { MemberItem } from './member-item'
import { UserItem } from './user-item'

export function MemberSidebar() {
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
          <MemberItem verified={true} untrustworthy={false} indicator="online">
            pvl.eth
          </MemberItem>
          <MemberItem verified={false} untrustworthy={false} indicator="online">
            carmen
          </MemberItem>
          <MemberItem verified={false} untrustworthy={false} indicator="online">
            carmen
          </MemberItem>
        </MemberGroup>
        <MemberGroup label="Offline">
          <MemberItem verified={false} untrustworthy indicator="offline">
            mark
          </MemberItem>
          <MemberItem
            verified={false}
            untrustworthy={false}
            indicator="offline"
          >
            mark
          </MemberItem>
        </MemberGroup>
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

  '@medium': {
    display: 'block',
  },
})
