import React from 'react'
import styled from 'styled-components'
import { PageInfo } from '../components/PageInfo'
import { Rules } from '../components/Rules'
import { Header } from '../components/top/TopBar'
import { ConnectMobile } from '../componentsMobile/ConnectMobile'

export function InfoMobile() {
  return (
    <div>
      <InfoMobileWrap>
        <ConnectMobile />
        <PageInfo
          heading="What is this DApp about?"
          text="This DApp allows SNT holders determine which communities should be included in the Status Communities directory"
        />
      </InfoMobileWrap>
      <Rules />
    </div>
  )
}

const InfoMobileWrap = styled(Header)`
  height: 166px;
`
