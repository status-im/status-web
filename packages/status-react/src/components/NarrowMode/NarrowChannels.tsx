import React from 'react'

import { Channels } from '../Channels/Channels'

import { ListWrapper, NarrowTopbar } from './NarrowTopbar'

interface NarrowChannelsProps {
  setShowChannels: (val: boolean) => void
}

export function NarrowChannels({ setShowChannels }: NarrowChannelsProps) {
  return (
    <ListWrapper>
      <NarrowTopbar list="Channels" onBtnClick={() => setShowChannels(false)} />
      <Channels onCommunityClick={() => setShowChannels(false)} />
    </ListWrapper>
  )
}
