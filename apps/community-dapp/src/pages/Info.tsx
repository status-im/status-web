import React from 'react'
import { InfoWrap, PageInfo } from '../components/PageInfo'
import { Rules } from '../components/Rules'

export function Info() {
  return (
    <div>
      <InfoWrap>
        <PageInfo
          heading="What is this DApp about?"
          text="This DApp allows SNT holders determine which communities should be included in the Status Communities directory"
        />
      </InfoWrap>
      <Rules />
    </div>
  )
}
