import { useReducer } from 'react'

import type { ChannelData, ChannelsData } from '../../models/ChannelData'

export type ChannelsState = {
  channels: ChannelsData
  activeChannel: ChannelData
}

export type ChannelAction =
  | { type: 'AddChannel'; payload: ChannelData }
  | { type: 'UpdateActive'; payload: ChannelData }
  | { type: 'ChangeActive'; payload: string }
  | { type: 'ToggleMuted'; payload: string }
  | { type: 'RemoveChannel'; payload: string }

function channelReducer(
  state: ChannelsState,
  action: ChannelAction
): ChannelsState {
  switch (action.type) {
    case 'AddChannel': {
      const channels = {
        ...state.channels,
        [action.payload.id]: action.payload,
      }
      return { channels, activeChannel: action.payload }
    }
    case 'UpdateActive': {
      const activeChannel = state.activeChannel
      if (activeChannel) {
        return {
          channels: { ...state.channels, [activeChannel.id]: action.payload },
          activeChannel: action.payload,
        }
      }
      return state
    }
    case 'ChangeActive': {
      const newActive = state.channels[action.payload]
      if (newActive) {
        return { ...state, activeChannel: newActive }
      }
      return state
    }
    case 'ToggleMuted': {
      const channel = state.channels[action.payload]
      if (channel) {
        const updatedChannel: ChannelData = {
          ...channel,
          isMuted: !channel.isMuted,
        }
        return {
          channels: { ...state.channels, [channel.id]: updatedChannel },
          activeChannel: updatedChannel,
        }
      }
      return state
    }
    case 'RemoveChannel': {
      const channelsCopy = { ...state.channels }
      delete channelsCopy[action.payload]
      let newActive = { id: '', name: '', type: 'channel' } as ChannelData
      if (Object.values(channelsCopy).length > 0) {
        newActive = Object.values(channelsCopy)[0]
      }
      return { channels: channelsCopy, activeChannel: newActive }
    }
    default:
      throw new Error()
  }
}

export function useChannelsReducer() {
  return useReducer(channelReducer, {
    channels: {},
    activeChannel: { id: '', name: '', type: 'channel' },
  } as ChannelsState)
}
